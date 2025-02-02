import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // when run local server
// import pkg from "uuid"; // when run containerized server
// const { v4: uuidv4 } = pkg; // when run containerized server
import bcrypt from "bcrypt";
import {
  Item,
  users_model,
  auctions_model,
  auction_list_model,
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
  static async save_user(body) {
    await Mongo.connect();
    const { email, password, username, profile, phoneNumber, fullName } = body;
    const existingUser = await users_model.findOne({ email });
    if (existingUser) {
      return 400;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new users_model({
      username: username,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      profile: {
        fullName: fullName,
        avatarUrl: "null",
      },
    });
    await newUser.save();
    return newUser;
  }
  static async users_list() {
    const u_list = await users_model.find();
    console.log(u_list);
    return u_list;
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
    Mongo.connect();
    console.log("line 87");
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
    console.log("line 101");
    const newItem_list = new auction_list_model({
      auctions: [
        {
          name: title,
          start_at: startDate,
          end_at: endDate,
        },
      ],
    });
    await newItem.save();
    await newItem_list.save();
    console.log("line 113");
    return { message: "Item added successfully", item: newItem };
  }
  static async auction_list() {
    Mongo.connect();
    const list = await auction_list_model.find();
    return { message: "list of auctions", list: list };
  }
  static async save_bid(body) {
    const { auctionId, bidder, amount } = body;
    // Create a new bid document
    const newBid = new bids_model({
      auctionId,
      bidder,
      amount,
    });

    // Save bid to MongoDB
    await newBid.save();

    const { name, price } = request.body;
    const newItem = new Item({ name, price });
    await newItem.save();
    console.log({ message: "Item added successfully", item: newItem });
    const items = await Item.find();
    response.send(items);
  }
  static async validate(email, password) {
    const user = users_model.findOne({ email });
    if (!user) return false;
    return bcrypt.compareSync(password, user.password);
  }
  static async get_auction(auctionId) {
    return await auctions_model.findById(auctionId).title;
  }
}
