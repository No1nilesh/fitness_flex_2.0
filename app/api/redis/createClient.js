import Redis from "ioredis";

const redisClient = new Redis();

redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Client Connection Error", err);
});

export { redisClient };
