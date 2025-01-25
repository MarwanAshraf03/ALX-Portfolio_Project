import Mosquitto from "../models/mosquitto";
import Mongo from "../models/mongo";
export default class AdminController {
  static count = 0;

  static getAuctionActiviy(request, response) {
    AdminController.count += 1; // Directly use the class name
    console.log("hello from admin.js");
    response.send(`This is the ${AdminController.count}th request\n`);
  }
  static createAuction(request, response) {
    // create auction in mongo and in mosquitto at the same time
    // create a topic in mosquitto with the auction name and its starting price
    // validate auction data
    // add auction to mongo db
    const { auction_name, starting_price } = request.body;
    Mosquitto.publish_auction(auction_name, starting_price);
    // Mongo.;
    AdminController.count += 1; // Directly use the class name
    console.log("hello from admin.js");
    response.send(`This is the ${AdminController.count}th request\n`);
  }
  static config_auction() {}
  static getAuctionActiviy() {}
}
