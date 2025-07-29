import Mosquitto from "../models/mosquitto.js";
import Mongo from "../models/mongo.js";
import { v4 as uuidv4 } from "uuid"; // when run local server
// import pkg from "uuid"; // when run containerized server
// const { v4: uuidv4 } = pkg; // when run containerized server
export default class AdminController {
  static count = 0;

  static async getAuctionActiviy(request, response) {
    // response.json({ message: "hello world" });
    try {
      const auctions = await Mongo.auction_list();
      const activity = auctions.map((auction) => ({
        title: auction.title,
        startDate: auction.startDate,
        endDate: auction.endDate,
        status: auction.status,
      }));
      response.status(200).json({ activity });
    } catch (error) {
      console.error("Error fetching auction activity:", error);
      response
        .status(500)
        .json({ message: "Failed to fetch auction activity." });
    }
  }

  static async createAuction(request, response) {
    const { title, startingPrice } = request.body;
    Mosquitto.publish_auction(title, startingPrice);
    console.log(title, startingPrice);
    const ret = await Mongo.save_auction(request.body);
    response.send(ret);
  }

  static async get_all_auction(request, response) {
    response.send(await Mongo.auction_list());
  }
  static config_auction(request, response) {
    response.send("hello world");
  }
  static async list_users(request, response) {
    response.send({ message: "list of users", list: await Mongo.users_list() });
  }
}
