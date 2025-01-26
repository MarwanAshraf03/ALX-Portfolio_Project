import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // when run local server
// import pkg from "uuid"; // when run containerized server
// const { v4: uuidv4 } = pkg; // when run containerized server

import {
  Item,
  users_model,
  auctions_model,
  bids_model,
} from "../utils/mongo_models.js";

export default class Mongo {
  //   static mongoURI = "mongodb://mongo:27017/AuctionEase"; // when running containerized server
  static mongoURI = "mongodb://localhost:27017/AuctionEase"; // when running local server

  static async connect() {
    await mongoose.connect(Mongo.mongoURI);
    const db = mongoose.connection;
    db.on("error", (err) => console.error("MongoDB connection error:", err));
    db.once("open", () => console.log("Connected to MongoDB"));
  }

  static async save_user(model) {
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
      description = "null",
      imageUrl = "null",
      startingPrice,
      currentPrice,
      startDate,
      endDate,
      createdBy,
      status,
      bidIncrement,
    } = body;
    console.log(`
title: ${title},\t
description: ${description},\t
imageUrl: ${imageUrl},\t
startingPrice: ${startingPrice},\t
currentPrice: ${currentPrice},\t
startDate: ${startDate},\t
endDate: ${endDate},\t
createdBy: ${createdBy},\t
status: ${status},\t
bidIncrement: ${bidIncrement},\n
        `);
    Mongo.connect();
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

  static async auction_list() {
    Mongo.connect();

    const list = await auctions_model.find();

    return { message: "list of auctions", list: list };
  }

  static async save_bid() {
    const { name, price } = request.body;

    const newItem = new Item({ name, price });
    await newItem.save();

    console.log({ message: "Item added successfully", item: newItem });

    const items = await Item.find();
    response.send(items);
  }
}

// curl "localhost:3000/create_auction" -X POST -d  '{"title": "Auction1","description": "null","imageUrl": "null","startingPrice": "10","currentPrice": "10","startDate": "1738477581143","endDate": "1739082381143","createdBy": "1cb30c0f-630e-4079-8f97-f2eb93a89762","status": "upcoming","bidIncrement": "5", }'
