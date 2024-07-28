"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Device } from "mediasoup-client";
import usePlayers from "./usePlayers";
import { cloneDeep } from "lodash";
import { toast } from "sonner";
import { io } from "socket.io-client";

export default function useVideoConference(roomName, setMyVideo, myVideo) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [myVideoId, setMyVideoId] = useState([]);
  const { setPlayers, players, setAudioPlayer, audioPlayer } = usePlayers(
    myVideoId,
    setMyVideo,
    myVideo,
    roomName,
    socket
  );

  const [localStream, setLocalStream] = useState(null);
  const [device, setDevice] = useState(null);
  const [email, setEmail] = useState(null);
  const [rtpCapabilities, setRtpCapabilities] = useState(null);
  const [producerTransport, setProducerTransport] = useState(null);
  const [consumerTransport, setConsumerTransport] = useState([]);
  const [consumingTransport, setConsumingTransport] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [audioParams, setAudioParams] = useState(null);

  const [Params, setParams] = useState({
    encoding: [
      { rid: "r0", maxBitrate: 100000, scalabilityMode: "S1T3" }, // Lowest quality layer
      { rid: "r1", maxBitrate: 300000, scalabilityMode: "S1T3" }, // Middle quality layer
      { rid: "r2", maxBitrate: 900000, scalabilityMode: "S1T3" }, // Highest quality layer
    ],
    codecOptions: { videoGoogleStartBitrate: 1000 }, // Initial bitrate
  });

  //

  const toggleRemoteUserVideo = (playerId) => {
    console.log("user video", playerId);
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[playerId].playing = !copy[playerId].playing;
      return { ...copy };
    });
    let action;
    const play = players[playerId];
    play.playing ? (action = "pause") : (action = "play");

    socket.emit("toggle-remote-video", playerId, roomName, action);
  };

  const toggleRemoteUserAudio = (audioId, videoId) => {
    console.log(audioId);
    // setPlayers((prev) => {
    //   const copy = cloneDeep(prev);
    //   copy[videoId].muted = !copy[videoId].muted;
    //   return { ...copy };
    // });

    setAudioPlayer((prev) => {
      const copy = cloneDeep(prev);
      copy[audioId].muted = !copy[audioId].muted;
      return { ...copy };
    });

    let action;
    const play = audioPlayer[audioId];
    play.muted ? (action = "play") : (action = "pause");
    socket.emit("toggle-remote-audio", audioId, videoId, roomName, action);
  };

  const toggleAudio = () => {
    setMyVideo((prev) => ({
      ...prev,
      muted: !prev.muted,
    }));
    const action = myVideo.muted ? "play" : "pause";
    console.log(action);
    socket.emit("user-toggle-audio", myVideoId, roomName, action);
    // const audioTacks = localStream
    //   .getTracks()
    //   .find((track) => track.kind == "audio");

    // audioTacks.enabled = !audioTacks.enabled;
  };

  const toggleVideo = () => {
    setMyVideo((prev) => ({
      ...prev,
      playing: !prev.playing,
    }));
    const action = myVideo.playing ? "pause" : "play";
    // const videoTrack = localStream
    //   .getTracks()
    //   .find((track) => track.kind == "video");

    // videoTrack.enabled = !videoTrack.enabled;
    socket.emit("user-toggle-video", myVideoId, roomName, action);
  };

  const handleCallDisconnect = () => {
    socket.emit("disconnect-call", { myVideoId, roomName, email });
  };

  useEffect(() => {
    const socket = io("http://localhost:3001/mediasoup");
    setSocket(socket);
    const device = new Device();
    setDevice(device);
    setEmail(session?.user.email);
    // return () => {
    //   socket.disconnect();
    // };
  }, [session?.user.email]);

  // notification
  useEffect(() => {
    if (!socket) return;
    socket.on("notification", ({ message }) => {
      toast.message(message);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      if (localStream) {
        const tracks = localStream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, [localStream]);

  useEffect(() => {
    console.log("socket", socket);
    if (!socket || !email) return;
    const startChat = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        setParams((current) => ({ ...current, track: videoTrack }));
        setAudioParams((current) => ({ ...current, track: audioTrack }));
        //JOIN ROOM
        joinRoom();
      } catch (error) {
        console.log("Error accessing the camera", error);
      }
    };
    socket.on("connection-success", startChat);
    return () => {
      socket.off("connection-success", startChat);
    };
  }, [socket, email]);

  const checkAdmin = (email, roomName) => {
    socket.emit("check-admin", { email, roomName }, (data) => {
      setIsAdmin(data);
    });
  };

  useEffect(() => {
    if (rtpCapabilities) {
      createDevice();
    }
  }, [rtpCapabilities]);

  useEffect(() => {
    if (producerTransport) {
      connectSendTransport();
    }
  }, [producerTransport]);

  const handleNewProducer = useCallback(
    ({ producerId }) => {
      console.log("new producer");
      signalNewConsumerTransport(producerId);
    },
    [socket, device]
  );

  const handleRemoteVideoToggled = useCallback(
    (playerId, action) => {
      if (myVideoId.includes(playerId)) {
        setMyVideo((prev) => ({
          ...prev,
          playing: !prev.playing,
        }));
      } else {
        setPlayers((prev) => {
          const copy = cloneDeep(prev);
          copy[playerId].playing = !copy[playerId].playing;
          return { ...copy };
        });
      }
    },
    [myVideoId]
  );

  const handleRemoteAudioToggled = useCallback(
    (audioId, videoId, action) => {
      console.log(audioId, videoId);
      if (myVideoId.includes(videoId)) {
        setMyVideo((prev) => ({
          ...prev,
          muted: !prev.muted,
        }));
      } else {
        // setPlayers((prev) => {
        //   const copy = cloneDeep(prev);
        //   copy[videoId].muted = !copy[videoId].muted;
        //   return { ...copy };
        // });

        setAudioPlayer((prev) => {
          const copy = cloneDeep(prev);
          copy[audioId].muted = !copy[audioId].muted;
          return { ...copy };
        });
      }
    },
    [myVideoId]
  );

  useEffect(() => {
    if (!socket || !device) return;
    socket.on("new-producer", handleNewProducer);
    socket.on("remote-video-toggled", handleRemoteVideoToggled);
    socket.on("remote-audio-toggled", handleRemoteAudioToggled);
    return () => {
      socket.off("new-producer", handleNewProducer);
      socket.off("remote-video-toggled", handleRemoteVideoToggled);
      socket.off("remote-audio-toggled", handleRemoteAudioToggled);
    };
  }, [socket, myVideoId]);

  useEffect(() => {
    if (!socket) return;
    const handleProducerClosed = async ({ remoteProducerId }) => {
      console.log("consumerTransport", consumerTransport);
      const producerToClose = consumerTransport.find(
        (transportData) => transportData.producerId == remoteProducerId
      );
      console.log("producerclose", producerToClose);
      // producerToClose.consumerTransport.close();
      // producerTransport.consumer.close();
      setConsumerTransport(
        consumerTransport.filter(
          (transportData) => transportData.producerId !== remoteProducerId
        )
      );
      setPlayers((prevPlayers) => {
        const { [remoteProducerId]: removedPlayer, ...remainingPlayers } =
          prevPlayers;
        return remainingPlayers;
      });
      setAudioPlayer((prevPlayers) => {
        const { [remoteProducerId]: removedPlayer, ...remainingPlayers } =
          prevPlayers;
        return remainingPlayers;
      });
    };

    socket.on("producer-closed", handleProducerClosed);
    return () => {
      socket.off("producer-closed", handleProducerClosed);
    };
  }, [socket, consumerTransport]);

  const joinRoom = () => {
    socket.emit("joinRoom", { roomName, email }, (data) => {
      console.log(`Router RTP Capabilities: ${data.rtpCapabilities}`);
      setRtpCapabilities(data.rtpCapabilities);
      checkAdmin(email, roomName);
    });
  };

  const createDevice = useMemo(
    () => async () => {
      try {
        await device.load({ routerRtpCapabilities: rtpCapabilities });
        console.log("Device RTP Capabilities", device.rtpCapabilities);
        createSendTransport();
      } catch (error) {
        console.log(error);
        if (error.name === "UnsupportedError")
          console.warn("browser not supported");
      }
    },
    [rtpCapabilities]
  );

  const createSendTransport = () => {
    if (!socket) return;

    socket.emit("createWebRtcTransport", { consumer: false }, ({ params }) => {
      if (params.error) {
        console.log(params.error);
        return;
      }
      console.log("createSendTransport params:", params);
      const transport = device.createSendTransport(params);
      setProducerTransport(transport);

      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.emit("transport-connect", {
            dtlsParameters,
          });
          callback();
        } catch (error) {
          errback(error);
        }
      });

      transport.on("produce", async (parameters, callback, errback) => {
        console.log("parameters", parameters);

        try {
          await socket.emit(
            "transport-produce",
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
            },
            ({ id, producerExist }) => {
              setMyVideoId((prev) => [...prev, id]);
              console.log("video id", id);
              callback({ id });
              if (producerExist) getProducers();
            }
          );
        } catch (error) {
          errback(error);
        }
      });
    });
  };

  const connectSendTransport = useCallback(async () => {
    let videoProducer = await producerTransport.produce(Params);
    let audioProducer = await producerTransport.produce(audioParams);

    videoProducer.on("trackended", () => {
      console.log("video track ended");
    });

    videoProducer.on("transportclose", () => {
      console.log("====================================");
      console.log("video transport ended");
      console.log("====================================");
    });
    audioProducer.on("trackended", () => {
      console.log("video track ended");
    });

    audioProducer.on("transportclose", () => {
      console.log("====================================");
      console.log("video transport ended");
      console.log("====================================");
    });
  }, [producerTransport]);

  const signalNewConsumerTransport = async (remoteProducerId) => {
    //check if we are already consuming the remoteProducerId
    if (consumingTransport.includes(remoteProducerId)) return;
    setConsumingTransport((prev) => [...prev, remoteProducerId]);

    await socket.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }) => {
        // The server sends back params needed
        // to create Send Transport on the client side
        if (params.error) {
          console.log(params.error);
          return;
        }
        console.log(`PARAMS... ${params}`);

        let consumerTransport;
        try {
          consumerTransport = device.createRecvTransport(params);
          console.log("consumerTransport", consumerTransport);
        } catch (error) {
          // exceptions:
          // {InvalidStateError} if not loaded
          // {TypeError} if wrong arguments.
          console.log(error);
          return;
        }

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              // Signal local DTLS parameters to the server side transport
              // see server's socket.on('transport-recv-connect', ...)
              await socket.emit("transport-recv-connect", {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error) {
              // Tell the transport that something was wrong
              errback(error);
            }
          }
        );

        connectRecvTransport(consumerTransport, remoteProducerId, params.id);
      }
    );
  };

  let videoProducerId;
  let playingState;
  const connectRecvTransport = async (
    consumerTransport,
    remoteProducerId,
    serverConsumerTransportId
  ) => {
    if (!socket) return;
    await socket.emit(
      "consume",
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }) => {
        if (params.error) {
          console.log("cannot Consume ");
          return;
        }
        console.log(`Consumer Params ${params.producerId}`);

        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        setConsumerTransport((prev) => [
          ...prev,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ]);

        const { track } = consumer;

        const mediaTrack = new MediaStream([track]);

        console.log("params", mediaTrack);

        // Emit an event to request the state of a producer

        if (params.kind === "video") {
          socket.emit("get-video-producer-state", remoteProducerId, roomName);
          socket.once("video-producer-state-response", (data) => {
            console.log("producerState", data);
            videoProducerId = remoteProducerId;
            playingState =
              data.producerId === remoteProducerId && data.state === "paused"
                ? false
                : true;
            setPlayers((prev) => ({
              ...prev,
              [remoteProducerId]: {
                url: mediaTrack,
                playing:
                  data.producerId === remoteProducerId &&
                  data.state === "paused"
                    ? false
                    : true,
                email: params.email,
              },
            }));
          });
        }

        if (params.kind === "audio") {
          console.log(remoteProducerId);
          socket.emit("get-audio-producer-state", remoteProducerId, roomName);
          socket.once("audio-producer-state-response", (data) => {
            console.log("audioState", data);

            setAudioPlayer((prev) => ({
              ...prev,
              [remoteProducerId]: {
                url: mediaTrack,
                muted:
                  data.producerId === remoteProducerId &&
                  data.state === "paused"
                    ? true
                    : false,
              },
            }));
          });
        }

        socket.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  const getProducers = () => {
    socket.emit("getProducers", (producerIds) => {
      //   console.log(producerIds);

      producerIds.forEach((id) => signalNewConsumerTransport(id));
    });
  };

  return {
    localStream,
    socket,
    device,
    players,
    myVideoId,
    toggleAudio,
    toggleVideo,
    toggleRemoteUserAudio,
    toggleRemoteUserVideo,
    handleCallDisconnect,
    audioPlayer,
    isAdmin,
  };
}
