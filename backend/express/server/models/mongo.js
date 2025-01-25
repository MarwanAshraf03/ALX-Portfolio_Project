import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {
  Item,
  users_model,
  auctions_model,
  bids_model,
} from "../utils/mongo_models.js";

export default class Mongo {
  // MongoDB connection URL (replace with your own if necessary)
  //   static mongoURI = "mongodb://mongo:27017/mydatabase"; // when running containerized server
  static mongoURI = "mongodb://localhost:27017/mydatabase"; // when running local server
  //   static id = uuidv4()

  // Connect to MongoDB
  static async connect(request, response) {
    mongoose.connect(Mongo.mongoURI);

    // Event listeners for MongoDB connection
    const db = mongoose.connection;
    db.on("error", (err) => console.error("MongoDB connection error:", err));
    db.once("open", () => console.log("Connected to MongoDB"));
  }

  static async save_user(model) {
    // response.send();
    // Create a simple schema and model

    const { name, price } = request.body;

    const newItem = new Item({ name, price });
    await newItem.save();

    console.log({ message: "Item added successfully", item: newItem });

    const items = await Item.find();
    response.send(items);
  }
  static async save_auction(body) {
    const {
      title,
      description,
      imageUrl,
      startingPrice,
      currentPrice,
      startDate,
      endDate,
      createdBy,
      status,
      bidIncrement,
    } = body;

    const newItem = new auctions_model({
      _id: uuidv4(),
      title: title,
      description: description,
      imageUrl: imageUrl,
      startingPrice: startingPrice,
      currentPrice: currentPrice,
      startDate: startDate,
      endDate: endDate,
      createdBy: createdBy,
      status: status,
      bidIncrement: bidIncrement,
    });
    await newItem.save();

    return { message: "Item added successfully", item: newItem };
  }
  static async save_bid() {
    // response.send();
    // Create a simple schema and model

    const { name, price } = request.body;

    const newItem = new Item({ name, price });
    await newItem.save();

    console.log({ message: "Item added successfully", item: newItem });

    const items = await Item.find();
    response.send(items);
  }
}
