import redis from "redis";
import { receiveMessageOnPort } from "worker_threads";

export default class redis_class {
  static client = redis.createClient({
    url: "redis://localhost:6379", // or use Docker IP if Redis runs in a container
    // url: "redis://redis:6379", // or use Docker IP if Redis runs in a container
  });

  static async conn() {
    redis_class.client.on("error", (err) => {
      console.error("Redis error:", err);
    });

    try {
      await redis_class.client.connect();
      console.log("Connected to Redis");
    } catch (error) {
      console.error("Error connecting to Redis:", error);
    }
  }
}
// Basic route
// const value = (await redis_class.client.get("counter")) || 0;
// console.log(`Counter value: ${value}`);

// // Reset counter
// await redis_class.client.set("counter", redis_class.counter++);
// await redis_class.client.disconnect();
// response.send(`Counter reset to ${redis_class.counter}`);
