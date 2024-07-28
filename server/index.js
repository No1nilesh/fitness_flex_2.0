// Initialize a Socket.IO server for WebSocket connections

const mediasoup = require("mediasoup");
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const Redis = require("ioredis");
const redis = new Redis();

const users = {}; //socketId of user who connects tp localhost:3001
io.on("connection", async (socket) => {
  console.log("User connected", socket.id);
  const emailId = socket.handshake.query.email;
  // console.log("emailId", emailId);
  users[emailId] = socket.id;
  socket.join(emailId);
  // await redis.hset(`member:${emailId}`, "socketId", socket.id);

  socket.on("creatingMeeting", async ({ email, roomName, assignedMembers }) => {
    const message = `${email} started a live chat Room ${roomName}`;
    console.log(assignedMembers, email, roomName);
    //
    const ttl = 60 * 60; // 1 hour in seconds
    redis.setex(
      `live_meeting:${email}`,
      ttl,
      JSON.stringify({ email, roomName })
    );

    // Create a unique room for this meeting
    const meetingRoom = `meeting_${roomName}`;

    // checks if the user is a member of a trainer
    assignedMembers.forEach((assignedEmail) => {
      if (users[assignedEmail]) {
        console.log("worked", users[assignedEmail]);
        const assignedSocketId = users[assignedEmail];
        io.sockets.sockets.get(assignedSocketId)?.join(meetingRoom);
      }
    });
    io.to(meetingRoom).emit("notification", { message, roomName });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete users[emailId];
  });
});

// Create a namespace "/mediaSoup" for mediaSoup-related socket events
const msConnection = io.of("/mediasoup");

let worker;
let peers = {};
let rooms = {};
let transports = [];
let producers = [];
let consumers = [];

const createWorker = async () => {
  const newWorker = await mediasoup.createWorker({
    rtcMinPort: 50000,
    rtcMaxPort: 59999,
  });

  console.log(`Worker process ID ${newWorker.pid}`);

  newWorker.on("died", (error) => {
    console.error("mediasoup worker died");

    setTimeout(() => {
      process.exit();
    }, 2000);
  });

  return newWorker;
};

createWorker().then((newWorker) => {
  worker = newWorker;
});

const mediaCodecs = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
    preferredPayLoadType: 96,
    rtcpFeedback: [{ type: "nack" }, { type: "nack", parameter: "pli" }],
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
    preferredPayLoadType: 97,
    rtcpFeedback: [
      { type: "nack" },
      { type: "ccm", parameter: "fir" },
      { type: "goog-remb" },
    ],
  },
];

msConnection.on("connection", async (socket) => {
  console.log(`Peer connected: ${socket.id}`);

  // checks the admin
  socket.on("check-admin", ({ email, roomName }, callback) => {
    const user = Object.values(peers)?.find(
      (peer) => peer.roomName === roomName && peer.peerDetails.email === email
    )?.peerDetails;
    console.log(user, email, roomName);
    callback(user?.isAdmin);
  });

  socket.emit("connection-success", { socketId: socket.id });

  const removeItems = (items, socketId, type) => {
    items.forEach((item) => {
      if (item.socketId === socket.id) {
        item[type].close();
      }
    });
    items = items.filter((item) => item.socketId !== socket.id);

    return items;
  };

  socket.on("disconnect", async () => {
    // Check if the socket ID exists in the peers object
    if (peers[socket.id]) {
      // do some cleanup
      console.log("peer disconnected", socket.id);
      try {
        consumers = removeItems(consumers, socket.id, "consumer");
        producers = removeItems(producers, socket.id, "producer");
        transports = removeItems(transports, socket.id, "transport");
      } catch (error) {
        console.log("you were not a consumer, producer or transport");
      }

      const { roomName } = peers[socket.id];
      if (roomName) {
        delete peers[socket.id];
        if (rooms[roomName]) {
          rooms[roomName] = {
            router: rooms[roomName].router,
            peers: rooms[roomName].peers.filter(
              (socketId) => socketId !== socket.id
            ),
          };
        }
      } else {
        console.log("Room name not found for disconnected socket:", socket.id);
      }
    } else {
      console.log("Peer not found:", socket.id);
    }
  });

  const assignAdmin = async (peerRoom, roomName, email) => {
    const isAdmin = await redis.hget(`user:${roomName}`, email);
    const isRoom = await redis.hget(`user:${roomName}`, "room");
    const isUser = await redis.exists(`user:${roomName}`);
    if (peerRoom.length == 0 && !isUser) {
      await redis.hset(`user:${roomName}`, email, "true", "room", roomName);
    }
    peers[socket.id] = {
      socket,
      roomName,
      transports: [],
      producers: [],
      consumers: [],
      peerDetails: {
        name: "",
        email: email,
        isAdmin:
          isRoom === roomName && isAdmin === "true"
            ? true
            : peerRoom.length > 0
            ? false
            : true,
      },
    };

    if (isAdmin === "true") {
      Object.values(peers).forEach((peer) => {
        if (peer.roomName === roomName && peer.peerDetails.email !== email) {
          peer.peerDetails.isAdmin = false;
        }
      });
    }
  };

  socket.on("event:scheduled", ({ email, roomName }) => {
    const peerRoom = Object.values(peers).filter(
      (peer) => peer.roomName === roomName
    );
    assignAdmin(peerRoom, roomName, email);
  });

  socket.on("joinRoom", async ({ roomName, email }, callback) => {
    socket.join(roomName);
    socket.broadcast
      .to(roomName)
      .emit("notification", { message: `${email} has Joined the room` });
    const router1 = await createRoom(roomName, socket.id);

    const room = Object.values(peers).filter(
      (peer) => peer.roomName === roomName
    );

    assignAdmin(room, roomName, email);
    const rtpCapabilities = router1.rtpCapabilities;

    callback({ rtpCapabilities });
  });

  socket.on("send:message", async ({ message, email, roomName, socketId }) => {
    console.log(message, email, roomName, socketId);
    await redis.rpush(`${roomName}`, JSON.stringify({ from: email, message }));
    msConnection.to(roomName).emit("on:message", { from: email, message });
  });

  socket.on("user-toggle-audio", (myVideoId, roomName, action) => {
    let pr = findProducer(myVideoId[1], roomName);

    if (action === "pause") {
      pr.pause();
    } else if (action === "play") {
      pr.resume();
    }

    socket.broadcast
      .to(roomName)
      .emit("remote-audio-toggled", myVideoId[1], myVideoId[0], action);
  });

  socket.on("user-toggle-video", (myVideoId, roomName, action) => {
    console.log(myVideoId);
    let pr = findProducer(myVideoId[0], roomName);

    if (action === "pause") {
      pr.pause();
    } else if (action === "play") {
      pr.resume();
    }
    socket.broadcast
      .to(roomName)
      .emit("remote-video-toggled", myVideoId[0], action);
  });

  socket.on("toggle-remote-audio", (audioId, videoId, roomName, action) => {
    console.log("User toggled audio");

    const pr = findProducer(audioId, roomName);
    if (!pr) return;

    if (action === "pause") {
      pr.pause();
    } else if (action === "play") {
      pr.resume();
    }

    socket.broadcast
      .to(roomName)
      .emit("remote-audio-toggled", audioId, videoId, action);
  });

  socket.on("toggle-remote-video", async (playerId, roomName, action) => {
    console.log("User toggled video");

    const pr = findProducer(playerId, roomName);
    if (!pr) return;

    try {
      if (action === "pause") {
        await pr.pause();
      } else if (action === "play") {
        await pr.resume();
      }

      socket.broadcast
        .to(roomName)
        .emit("remote-video-toggled", playerId, action);
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  });

  // Handle the client's request to get the state of a producer
  socket.on("get-audio-producer-state", (producerId, roomName) => {
    console.log("producerId", producerId);
    // Retrieve the state of the producer
    const producer = findProducer(producerId, roomName); // Implement this function to find the producer
    if (producer) {
      const state = producer.paused ? "paused" : "resumed";
      // Emit the response event along with the data
      socket.emit("audio-producer-state-response", { producerId, state });
    } else {
      // Handle case when producer is not found
      console.log("producer not found");
    }
  });
  // Handle the client's request to get the state of a producer
  socket.on("get-video-producer-state", (producerId, roomName) => {
    console.log("producerId", producerId);
    // Retrieve the state of the producer
    const producer = findProducer(producerId, roomName); // Implement this function to find the producer
    if (producer) {
      const state = producer.paused ? "paused" : "resumed";
      // Emit the response event along with the data
      socket.emit("video-producer-state-response", { producerId, state });
    } else {
      // Handle case when producer is not found
      console.log("producer not found");
    }
  });

  function findProducer(playerId, roomName) {
    const producerData = producers.find(
      (producerData) =>
        producerData.producer.id === playerId &&
        producerData.roomName === roomName
    );
    return producerData ? producerData.producer : null;
  }

  const createRoom = async (roomName, socketId) => {
    let router1;
    let peers = [];
    if (rooms[roomName]) {
      (router1 = rooms[roomName].router), (peers = rooms[roomName].peers || []);
    } else {
      router1 = await worker.createRouter({ mediaCodecs });
    }

    console.log(`Router Id: ${router1.id}, ${peers.length}`);
    rooms[roomName] = {
      router: router1,
      peers: [...peers, socketId],
    };
    return router1;
  };

  socket.on("createWebRtcTransport", async ({ consumer }, callback) => {
    const roomName = peers[socket.id].roomName;
    const router = rooms[roomName].router;

    createWebRtcTransport(router).then(
      (transport) => {
        callback({
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          },
        });
        addTransport(transport, roomName, consumer);
      },
      (error) => {
        console.log(error);
      }
    );
  });

  socket.on("getProducers", (callback) => {
    //return all producer transports
    const { roomName } = peers[socket.id];

    let producerList = [];
    producers.forEach((producerData) => {
      if (
        producerData.socketId !== socket.id &&
        producerData.roomName === roomName
      ) {
        producerList = [...producerList, producerData.producer.id];
      }
    });

    // return the producer list back to the client
    callback(producerList);
  });

  const addConsumer = (consumer, roomName) => {
    // add the consumer to the consumers list
    consumers = [...consumers, { socketId: socket.id, consumer, roomName }];

    // add the consumer id to the peers list
    peers[socket.id] = {
      ...peers[socket.id],
      consumers: [...peers[socket.id].consumers, consumer.id],
    };
  };
  const informConsumers = (roomName, socketId, id) => {
    console.log(`just joined, id ${id} ${roomName}, ${socketId}`);
    // A new producer just joined
    // let all consumers to consume this producer
    producers.forEach((producerData) => {
      if (
        producerData.socketId !== socketId &&
        producerData.roomName === roomName
      ) {
        const producerSocket = peers[producerData.socketId].socket;
        // use socket to send producer id to producer
        producerSocket.emit("new-producer", { producerId: id });
      }
    });
  };

  const getTransport = (socketId) => {
    const [producerTransport] = transports.filter(
      (transport) => transport.socketId === socketId && !transport.consumer
    );
    return producerTransport.transport;
  };

  const addProducer = (producer, roomName) => {
    producers = [...producers, { socketId: socket.id, producer, roomName }];

    peers[socket.id] = {
      ...peers[socket.id],
      producers: [...peers[socket.id].producers, producer.id],
    };
  };

  socket.on("transport-connect", async ({ dtlsParameters }) => {
    console.log("DTLS PARAMS", { dtlsParameters });
    getTransport(socket.id).connect({ dtlsParameters });
  });

  socket.on(
    "transport-produce",
    async ({ kind, rtpParameters, appData }, callback) => {
      const producer = await getTransport(socket.id).produce({
        kind,
        rtpParameters,
      });

      const { roomName } = peers[socket.id];
      addProducer(producer, roomName);
      informConsumers(roomName, socket.id, producer.id);
      console.log("PRODUCER ID:", producer.id, producer.kind);

      producer.on("transportclose", () => {
        console.log("transport for this producer closed");
        producer.close();
      });

      callback({
        id: producer.id,
        producerExist: producers.length > 1 ? true : false,
      });
    }
  );

  socket.on(
    "transport-recv-connect",
    async ({ dtlsParameters, serverConsumerTransportId }) => {
      console.log("DTLS PARAMS", { dtlsParameters });
      const consumerTransport = transports.find(
        (transportData) =>
          transportData.consumer &&
          transportData.transport.id == serverConsumerTransportId
      ).transport;
      await consumerTransport.connect({ dtlsParameters });
    }
  );

  socket.on(
    "consume",
    async (
      { rtpCapabilities, remoteProducerId, serverConsumerTransportId },
      callback
    ) => {
      try {
        const { roomName, peerDetails } = peers[socket.id];
        const router = rooms[roomName].router;
        let consumerTransport = transports.find(
          (transportData) =>
            transportData.consumer &&
            transportData.transport.id == serverConsumerTransportId
        ).transport;

        if (
          router.canConsume({
            producerId: remoteProducerId,
            rtpCapabilities,
          })
        ) {
          const consumer = await consumerTransport.consume({
            producerId: remoteProducerId,
            rtpCapabilities,
            paused: true,
          });

          consumer.on("transportclose", () => {
            console.log("transport close from consumer");
          });

          consumer.on("producerclose", () => {
            console.log("producer of consumer closed");
            socket.emit("producer-closed", { remoteProducerId });
            consumerTransport.close([]);
            transports = transports.filter(
              (transportData) =>
                transportData.transport.id !== consumerTransport.id
            );
            consumer.close();
            consumers = consumers.filter(
              (consumerData) => consumerData.consumer.id !== consumer.id
            );
          });

          const filteredPeer = Object.values(peers).filter(
            (peer) =>
              peer.roomName === roomName &&
              peer.producers?.includes(remoteProducerId)
          );

          const email = filteredPeer[0].peerDetails.email;

          addConsumer(consumer, roomName);

          const params = {
            id: consumer.id,
            producerId: remoteProducerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            serverConsumerId: consumer.id,
            email: email,
          };

          callback({ params });
        }
      } catch (error) {
        console.log(error.message);
        callback({
          params: {
            error: error,
          },
        });
      }
    }
  );

  socket.on("consumer-resume", async ({ serverConsumerId }) => {
    console.log("consumer Resume");
    const { consumer } = consumers.find(
      (consumerData) => consumerData.consumer.id == serverConsumerId
    );
    await consumer.resume();
  });

  socket.on("disconnect-call", ({ myVideoId, roomName, email }) => {
    if (redis.get(`live_meeting:${email}`)) {
      redis
        .del(`live_meeting:${email}`)
        .then((result) => {
          console.log(`Deleted ${result} key(s)`);
        })
        .catch((err) => {
          console.error("Error deleting key:", err);
        });
    }

    if (producers.length > 0) {
      myVideoId.map((id) =>
        producers
          .find((producerData) => producerData.producer.id === id)
          .producer.close()
      );
      socket.broadcast
        .to(roomName)
        .emit("notification", { message: `${email} left the chat` });
    }
  });

  const addTransport = (transport, roomName, consumer) => {
    transports = [
      ...transports,
      { socketId: socket.id, transport, roomName, consumer },
    ];
    peers[socket.id] = {
      ...peers[socket.id],
      transports: [...peers[socket.id].transports, transport.id],
    };
  };
  const createWebRtcTransport = async (router) => {
    return new Promise(async (resolve, reject) => {
      try {
        const webRtcTransportOptions = {
          listenIps: [
            {
              ip: "0.0.0.0", // replace with relevant IP address
              announcedIp: "127.0.0.1",
            },
          ],
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
        };

        let transport = await router.createWebRtcTransport(
          webRtcTransportOptions
        );
        console.log(`transport id: ${transport.id}`);

        transport.on("dtlsstatechange", (dtlsState) => {
          if (dtlsState === "closed") {
            transport.close();
          }
        });

        transport.on("close", () => {
          console.log("transport closed");
        });

        resolve(transport);
      } catch (error) {
        reject(error);
      }
    });
  };
});
