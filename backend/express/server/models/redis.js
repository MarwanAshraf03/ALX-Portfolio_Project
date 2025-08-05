import redis from "redis";
import { receiveMessageOnPort } from "worker_threads";
import Mongo from "./mongo.js";

export default class redis_class {
  static #client = redis.createClient({
    url: "redis://localhost:6379", // or use Docker IP if Redis runs in a container
    // url: "redis://redis:6379", // or use Docker IP if Redis runs in a container
  });

  static async #conn() {
    this.#client.on("error", (err) => {
      console.error("Redis error:", err);
    });

    try {
      await this.#client.connect();
      console.log("Connected to Redis");
    } catch (error) {
      console.error("Error connecting to Redis:", error);
    }
  }

  static async create_session(sessionId, userId) {
    await this.#conn();
    await this.#client.set(`session:${sessionId}`, userId, { EX: 3600 });
    await this.#client.disconnect();
    console.log("Redis Disconnected");
  }

  static async get_session(sessionId) {
    await this.#conn();
    const session = await this.#client.get(`session:${sessionId}`);
    await this.#client.disconnect();
    console.log("Redis Disconnected");
    return session;
  }

  static async delete_session(sessionId) {
    await this.#conn();
    const session = await this.#client.get(`session:${sessionId}`);
    if (!session) {
      console.error("Session not found");
      await this.#client.disconnect();
      return false;
    }
    await this.#client.del(`session:${sessionId}`);
    await this.#client.disconnect();
    console.log("Redis Disconnected");
    return true;
  }

  static async bid_on_auction(bid, endDate) {
    await this.#conn();
    const auctionKey = bid.auctionId;
    await this.#client.LPUSH(auctionKey, JSON.stringify(bid));

    const ttl = Math.floor((new Date(endDate).getTime() - Date.now()) / 1000);
    console.log("the time to live is: ", ttl, " seconds");
    if (ttl > 0) {
      await this.#client.EXPIRE(auctionKey, ttl);
    } else {
      console.error("Invalid endDate: must be a future date.");
    }

    // if auction has 6 bids remove the previous 5 and place them into mongodb
    // await this.#client.LLEN(auctionKey, async (err, length) => {
    //   if (err) {
    //     console.error("Error getting length of auction:", err);
    //   } else {
    //     if (length === 6) {
    //       for (let index = 0; index < 5; index++) {
    //         await this.#client.RPOP(auctionKey, (err, value) => {
    //           if (err) {
    //             console.error("Error popping bid from auction:", err);
    //           } else {
    //             Mongo.save_bid(JSON.parse(value));
    //           }
    //         });
    //       }
    //     }
    //   }
    // });
    await this.#client.disconnect();
    console.log("Redis Disconnected");
  }
  static async set_expiry(auctionId, endDate) {
    await this.#conn();
    const ttl = Math.floor((new Date(endDate).getTime() - Date.now()) / 1000);
    console.log("the time to live is: ", ttl, " seconds");
    if (ttl > 0) {
      await this.#client.EXPIRE(auctionId, ttl);
    } else {
      console.error("Invalid endDate: must be a future date.");
    }
    await this.#client.disconnect();
    console.log("Redis Disconnected");
  }
}
