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
    try {
      const list = await auction_list_model.find();
      return { message: "list of auctions", list: list };
    } catch (error) {
      console.error("Error fetching auction list:", error);
      throw new Error("Failed to fetch auction list");
    }
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
    const user = await users_model.findOne({ email });
    if (!user) return false;
    return bcrypt.compareSync(password, user.password);
  }
  static async get_auction(auctionId) {
    return await auctions_model.findById(auctionId).title;
  }
}

// MarwanAshraf03: are you able to see the whole project?

// GitHub Copilot: No, I can only see the code you have shared with me. If you need help with a specific part of your project, please provide the relevant code or describe the issue in detail.

// MarwanAshraf03: what is wrong with this code

// GitHub Copilot: To identify potential issues, let's review the code step-by-step:

// 1. **Logging and Response**: The code logs a message and sends a JSON response indicating subscription to auction bid updates.
// 2. **MQTT Client**: The code listens for messages on a specific topic and processes bid updates.
// 3. **Error Handling**: The code catches and logs errors.

// Here are some potential issues:

// 1. **Unclosed `try` block**: The `try` block is not closed, which will cause a syntax error.
// 2. **Unclosed

// mqttClient.on("message", ...)

//  block**: The

// mqttClient.on("message", ...)

//  block is not closed, which will also cause a syntax error.
// 3. **Undefined Variables**: Ensure

// userId

// ,

// auctionId

// ,

// mqttClient

// ,

// redisClient

// ,

// Mongo

// , and

// res

//  are defined and in scope.

// Here's a corrected version of the code:

// ```javascript

// try {
//   console.log(`User ${userId} subscribed to auction ${auctionId}/bids`);
//   return res.status(200).json({
//     message: `Subscribed to auction ${Mongo.get_auction(auctionId)} bid updates.`,
//   });

//   mqttClient.on("message", (topic, message) => {
//     if (topic === `auction/${auctionId}/bids`) {
//       const bidData = JSON.parse(message.toString());
//       console.log(`New bid update for auction ${auctionId}:`, bidData);
//       redisClient.set(`auction:${auctionId}:latestBid`, JSON.stringify(bidData));
//     }
//   });
// } catch (error) {
//   console.error("Error subscribing to auction:", error);
//   return res.status(500).json({ error: "Error subscribing to auction" });
// }
// ```

// Make sure to define all necessary variables and ensure they are in scope.

// MarwanAshraf03: is there issue with this code?

// GitHub Copilot: Based on the provided context, here are a few potential issues and improvements:

// 1. **Unclosed `try` block**: The `try` block in

// user.js

//  is not closed.
// 2. **Error Handling**: Ensure proper error handling in asynchronous functions.
// 3. **Variable Scope**: Ensure all variables (

// userId

// ,

// auctionId

// ,

// mqttClient

// ,

// redisClient

// ,

// Mongo

// ,

// res

// ) are defined and in scope.

// Here's the corrected code for

// user.js

// :

// ```javascript

// try {
//   console.log(`User ${userId} subscribed to auction ${auctionId}/bids`);
//   return res.status(200).json({
//     message: `Subscribed to auction ${Mongo.get_auction(auctionId)} bid updates.`,
//   });

//   mqttClient.on("message", (topic, message) => {
//     if (topic === `auction/${auctionId}/bids`) {
//       const bidData = JSON.parse(message.toString());
//       console.log(`New bid update for auction ${auctionId}:`, bidData);
//       redisClient.set(`auction:${auctionId}:latestBid`, JSON.stringify(bidData));
//     }
//   });
// } catch (error) {
//   console.error("Error subscribing to auction:", error);
//   return res.status(500).json({ error: "Error subscribing to auction" });
// }
// ```

// Ensure all necessary variables are defined and in scope. For example:

// ```javascript
// const userId = ...; // Define userId
// const auctionId = ...; // Define auctionId
// const mqttClient = Mosquitto.getClient(); // Assuming Mosquitto is imported
// const redisClient = redis_class.client; // Assuming redis_class is imported
// const Mongo = ...; // Ensure Mongo is imported and used correctly
// const res = ...; // Ensure res is defined and in scope
// ```

// Additionally, ensure proper error handling in asynchronous functions and verify that all necessary imports and initializations are done correctly in other files.

// MarwanAshraf03: how to make getAuctionActivity suitable for its job?

// GitHub Copilot: The `getAuctionActiviy` method currently returns a string with dates. To make it more suitable for its job, you should return a structured response with auction activity details. Here's an improved version:

// 1. **Fetch Auction Data**: Retrieve auction data from the database.
// 2. **Format Response**: Format the response to include relevant auction activity details.

// Here's the updated code:

// ```javascript

// import Mongo from "../models/mongo.js";

// export default class AdminController {
//   static count = 0;

//   static async getAuctionActiviy(request, response) {
//     try {
//       const auctions = await Mongo.auction_list();
//       const activity = auctions.map(auction => ({
//         title: auction.title,
//         startDate: auction.startDate,
//         endDate: auction.endDate,
//         status: auction.status,
//       }));
//       response.status(200).json({ activity });
//     } catch (error) {
//       console.error("Error fetching auction activity:", error);
//       response.status(500).json({ message: "Failed to fetch auction activity." });
//     }
//   }

//   static async createAuction(request, response) {
//     const { title, startingPrice } = request.body;
//     Mosquitto.publish_auction(title, startingPrice);
//     console.log(title, startingPrice);
//     const ret = await Mongo.save_auction(request.body);
//     response.send(ret);
//   }

//   static async get_all_auction(request, response) {
//     response.send(await Mongo.auction_list());
//   }

//   static config_auction(request, response) {
//     response.send("hello world");
//   }

//   static async list_users(request, response) {
//     response.send({ message: "list of users", list: await Mongo.users_list() });
//   }
// }
// ```

// Ensure that the

// Mongo.auction_list()

//  method returns the necessary auction data. If it doesn't, you may need to update that method accordingly.

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
//     curl -X POST http://localhost:3000/sign_in \
//     -H "Content-Type: application/json" \
//     -d '{
//         "username": "testuser",
//         "password": "password123"
//     }'
//     ```

// 2. **Log In**
//     ```sh
//     curl -X GET http://localhost:3000/log_in \
//     -H "Content-Type: application/json" \
//     -d '{
//         "username": "testuser",
//         "password": "password123"
//     }'
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
//     curl -X POST http://localhost:3000/create_auction \
//     -H "Content-Type: application/json" \
//     -d '{
//         "title": "New Auction",
//         "description": "A new auction for testing",
//         "imageUrl": "http://example.com/image.jpg",
//         "startingPrice": 100,
//         "currentPrice": 100,
//         "startDate": "2023-10-01T00:00:00Z",
//         "endDate": "2023-10-10T00:00:00Z",
//         "createdBy": "1cb30c0f-630e-4079-8f97-f2eb93a89762",
//         "status": "upcoming",
//         "bidIncrement": 10
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
//     curl -X POST http://localhost:3000/sign_in \
//     -H "Content-Type: application/json" \
//     -d '{
//         "username": "testuser",
//         "email": "testuser@example.com",
//         "password": "password123",
//         "phoneNumber": "1234567890",
//         "profile": {
//             "fullName": "Test User",
//             "avatarUrl": "http://example.com/avatar.jpg"
//         }
//     }'
//     ```

// 2. **Log In**
//     ```sh
//     curl -X GET http://localhost:3000/log_in \
//     -H "Content-Type: application/json" \
//     -d '{
//         "username": "testuser",
//         "password": "password123"
//     }'
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
