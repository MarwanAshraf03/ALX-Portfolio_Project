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
  static async create_session(sessionId, email) {
    await redis_class.conn();
    await redis_class.client.set(`session:${sessionId}`, email, { EX: 10 }); // Session expires in 1 hour
    await redis_class.client.disconnect();
    console.log("Redis Disconnected");
  }
}
