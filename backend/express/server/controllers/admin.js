import Mosquitto from "../models/mosquitto.js";
import Mongo from "../models/mongo.js";
import { v4 as uuidv4 } from "uuid"; // when run local server
// import pkg from "uuid"; // when run containerized server
// const { v4: uuidv4 } = pkg; // when run containerized server
export default class AdminController {
  static count = 0;

  static getAuctionActiviy(request, response) {
    response.send(
      `${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}\n${
        Date.now() + 7 * 24 * 60 * 60 * 1000
      }\n${Date.now() + 14 * 24 * 60 * 60 * 1000}\n`
    );
  }
  static async createAuction(request, response) {
    // create auction in mongo and in mosquitto at the same time
    // create a topic in mosquitto with the auction name and its starting price
    // validate auction data
    // add auction to mongo db
    // const { auction_name, starting_price } = request.body;
    // Mosquitto.publish_auction(auction_name, starting_price);
    const ret = await Mongo.save_auction(request.body);
    response.send(ret);
    // AdminController.count += 1; // Directly use the class name
    // console.log("hello from admin.js");
    // response.send(`This is the ${AdminController.count}th request\n`);
  }
  static async get_all_auction(request, response) {
    response.send(await Mongo.auction_list());
  }
  static config_auction(request, response) {
    response.send("hello world");
  }
  //   static getAuctionActiviy() {}
}
