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
import redis_class from "./redis.js";
export default class Mongo {
  //   static mongoURI = "mongodb://mongo:27017/AuctionEase"; // when running containerized server
  static mongoURI = "mongodb://localhost:27017/AuctionEase"; // when running local server
  static async connect() {
    await mongoose.connect(Mongo.mongoURI);
    const db = mongoose.connection;
    db.on("error", (err) => console.error("MongoDB connection error:", err));
    db.once("open", () => console.log("Connected to MongoDB"));
  }

  static async save_auction(body) {
    const {
      title,
      description = "null",
      imageUrl = "null",
      startingPrice,
      startDate,
      endDate,
      createdBy = "854cc558-d014-4bb1-958a-e28377329f5e",
      status,
      bidIncrement,
    } = body;
    Mongo.connect();
    console.log("line 87");
    const newItem = new auctions_model({
      _id: title + "@" + createdBy,
      title: title,
      description: description,
      imageUrl: imageUrl,
      startingPrice: startingPrice,
      startDate: startDate,
      endDate: endDate,
      createdBy: createdBy,
      status: status,
      bidIncrement: bidIncrement,
    });
    console.log("line 101");
    const newItem_list = new auction_list_model({
      // auctions: [
      //   {
      //     name: title,
      //     start_at: startDate,
      //     end_at: endDate,
      //   },
      // ],
      _id: title + "@" + createdBy,

      title: title,
      startDate: startDate,
      endDate: endDate,
      status: status,
    });
    // check if the auction already exists
    const existingAuction = await auctions_model.findOne({
      _id: newItem._id,
    });

    if (existingAuction) {
      console.log("Auction already exists");
      return { status: 400, message: { message: "Auction already exists" } };
    }

    const bid = new bids_model({
      _id: uuidv4(), // Unique bid ID
      auctionId: title + "@" + createdBy,
      bidder: createdBy,
      amount: startingPrice,
      placedAt: startDate,
    });

    await redis_class.bid_on_auction(bid, endDate);
    await newItem.save();
    await newItem_list.save();
    console.log("line 113");
    return {
      status: 200,
      message: { message: "Item added successfully", item: newItem },
    };
  }

  static async update_auction(body) {
    Mongo.connect();
    const {
      title,
      description,
      imageUrl,
      startingPrice,
      startDate,
      endDate,
      createdBy = "854cc558-d014-4bb1-958a-e28377329f5e",
      status,
      bidIncrement,
    } = body;
    const updatedItem = await auctions_model.findOneAndUpdate(
      { _id: title + "@" + createdBy },
      {
        description: description,
        imageUrl: imageUrl,
        startingPrice: startingPrice,
        startDate: startDate,
        endDate: endDate,
        createdBy: createdBy,
        status: status,
        bidIncrement: bidIncrement,
      },
      { new: true }
    );
    await auction_list_model.findOneAndUpdate(
      { _id: title + "@" + createdBy },
      {
        startDate: startDate,
        endDate: endDate,
        status: status,
      },
      { new: true }
    );
    await redis_class.set_expiry(title + "@" + createdBy, endDate);
    return updatedItem;
  }
  // static async get_auction(auctionId) {
  //   return await auctions_model.findById(auctionId).title;
  // }

  static async get_auction(title, createdBy) {
    Mongo.connect();
    const auction = await auctions_model.findOne({
      _id: title + "@" + createdBy,
    });
    return auction;
  }

  static async auction_list_mongo(status = null) {
    try {
      Mongo.connect();
      if (status) {
        const list = await auction_list_model.find({ status: status });
        return list;
      } else {
        const list = await auction_list_model.find();
        return list;
      }
      // const list = await auctions_model.find();
      // const list = await auctions_model.find();
      // return { message: "list of auctions", list: list };
      // return list;
    } catch (error) {
      console.error("Error fetching auction list:", error);
      throw new Error("Failed to fetch auction list");
    }
  }

  static async save_user(body) {
    await Mongo.connect();
    // const { email, password, username, profile, phoneNumber, fullName } = body;
    const {
      username,
      email,
      password,
      phoneNumber,
      // role,
      firstName,
      lastName,
      // avatarUrl,
    } = body;
    const existingUser = await users_model.findOne({ email });
    if (existingUser) {
      return { status: 400, message: "User already exists" };
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new users_model({
      username: username,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      // role: role,
      firstName: firstName,
      lastName: lastName,
      // avatarUrl: avatarUrl,
    });
    await newUser.save();
    return {
      status: 200,
      message: { message: "User added successfully", user: newUser },
    };
  }

  // static async users_list() {
  //   // Mongo.connect()
  //   await mongoose.connect(Mongo.mongoURI);
  //   const u_list = await users_model.find();
  //   console.log(u_list);
  //   return u_list;
  // }

  // static async save_bid(body) {
  //   const { auctionId, bidder, amount } = body;
  //   // Create a new bid document
  //   const newBid = new bids_model({
  //     auctionId,
  //     bidder,
  //     amount,
  //   });

  //   // Save bid to MongoDB
  //   await newBid.save();

  //   const { name, price } = request.body;
  //   const newItem = new Item({ name, price });
  //   await newItem.save();
  //   console.log({ message: "Item added successfully", item: newItem });
  //   const items = await Item.find();
  //   response.send(items);
  // }

  static async validate(email, password) {
    Mongo.connect();
    const user = await users_model.findOne({ email });
    if (!user) return false;
    if (bcrypt.compareSync(password, user.password)) return user._id;
    else return false;
  }
}

// MarwanAshraf03: create test case for each route of these routes using "curl"

// GitHub Copilot: Here are the `curl` commands to test each route:

// ### Admin Routes

// 1. **Get Auction Activity**
//     ```sh
//     curl -X GET http://localhost:3000/
//     ```

// 2. **Create Auction**
//     ```sh
//     curl -X POST http://localhost:3000/create_auction \
//     -H "Content-Type: application/json" \
//     -d '{
//         "title": "New Auction",
//         "startingPrice": 100
//     }'
//     ```

// 3. **Get All Auctions**
//     ```sh
//     curl -X GET http://localhost:3000/auction_list
//     ```

// 4. **List Users**
//     ```sh
//     curl -X GET http://localhost:3000/users_list
//     ```

// ### User Routes

// 1. **Sign In**
//     ```sh
//     curl -X POST http://localhost:3000/sign_in -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
//     ```

// 2. **Log In**
//     ```sh
//     curl -X GET http://localhost:3000/log_in -H "Content-Type: application/json" -d '{ "username": "testuser", "password": "password123"}'
//     ```

// 3. **Place a Bid**
//     ```sh
//     curl -X POST http://localhost:3000/bid \
//     -H "Content-Type: application/json" \
//     -d '{
//         "auctionId": "auction123",
//         "amount": 150
//     }'
//     ```

// 4. **Listen on Auction**
//     ```sh
//     curl -X GET http://localhost:3000/listen_on_auction \
//     -H "Content-Type: application/json" \
//     -d '{
//         "auctionId": "auction123"
//     }'
//     ```

// Replace `http://localhost:3000` with the actual URL and port where your server is running. Adjust the JSON payloads as needed based on your application's requirements.

// MarwanAshraf03: use these models to make the test cases more suitable for the task

// GitHub Copilot: To make the test cases more suitable for the task, we can use the models to create sample data for testing. Here are the updated `curl` commands with sample data:

// ### Admin Routes

// 1. **Get Auction Activity**
//     ```sh
//     curl -X GET http://localhost:3000/
//     ```

// 2. **Create Auction**
//     ```sh
//     curl -X POST http://localhost:3000/create_auction -H "Content-Type: application/json" -d '{ "title": "New Auction", "description": "A new auction for testing", "imageUrl": "http://example.com/image.jpg", "startingPrice": 100, "currentPrice": 100, "startDate": "2023-10-01T00:00:00Z", "endDate": "2023-10-10T00:00:00Z", "createdBy": "1cb30c0f-630e-4079-8f97-f2eb93a89762", "status": "upcoming", "bidIncrement": 10}'
//     ```

// 3. **Get All Auctions**
//     ```sh
//     curl -X GET http://localhost:3000/auction_list
//     ```

// 4. **List Users**
//     ```sh
//     curl -X GET http://localhost:3000/users_list
//     ```

// ### User Routes

// 1. **Sign In**
//     ```sh
//     curl -X POST http://localhost:3000/sign_in -H "Content-Type: application/json" -d '{"username": "testuser", "email": "testuser@example.com", "password": "Ppassword123", "phoneNumber": "1234567890", "profile": { "fullName": "Test User", "avatarUrl": "http://example.com/avatar.jpg"}}'
//     ```

// 2. **Log In**
//     ```sh
//     curl -X GET http://localhost:3000/log_in -H "Content-Type: application/json" -d '{"username": "testuser", "password": "Ppassword123"}'
//     ```

// 3. **Place a Bid**
//     ```sh
//     curl -X POST http://localhost:3000/bid \
//     -H "Content-Type: application/json" \
//     -d '{
//         "auctionId": "auction123",
//         "bidder": "user123",
//         "amount": 150
//     }'
//     ```

// 4. **Listen on Auction**
//     ```sh
//     curl -X GET http://localhost:3000/listen_on_auction \
//     -H "Content-Type: application/json" \
//     -d '{
//         "auctionId": "auction123"
//     }'
//     ```

// Replace `http://localhost:3000` with the actual URL and port where your server is running. Adjust the JSON payloads as needed based on your application's requirements.
