import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379
  }
});

client.on("error", (err) => console.log("Redis Error:", err));

await client.connect();

export default client;
