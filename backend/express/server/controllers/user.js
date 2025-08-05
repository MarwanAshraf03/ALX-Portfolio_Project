import Mongo from "../models/mongo.js";
import validator from "validator";
import { v4 as uuidv4 } from "uuid"; // when run local server
import redis_class from "../models/redis.js";
import { bids_model } from "../utils/mongo_models.js";
// import pkg from "uuid"; // when run containerized server
// const { v4: uuidv4 } = pkg; // when run containerized server

// TODO: make the backend use cookies where the sessionId will be saved
// to identify users
// sessionId will not be sent in authorization header in production
// instead it will be accessed via cookies

export default class UserController {
  // TODO: make admin able to assign roles using his id
  // till now all users are created with user as their role
  static async sign_in(req, res) {
    const required_params = [
      "username",
      "email",
      "password",
      "phoneNumber",
      "firstName",
      "lastName",
    ];
    const not_required_params = ["avatarUrl"];
    // Check if the body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("Request body cannot be empty!");
    }
    // Check if req.body contains any unexpected parameters
    const unexpectedParams = Object.keys(req.body).filter(
      (key) => ![...required_params, ...not_required_params].includes(key)
    );
    if (unexpectedParams.length > 0) {
      return res
        .status(400)
        .send(`Unexpected parameters: ${unexpectedParams.join(", ")}`);
    }
    // Check if all required parameters are present
    const missingParams = required_params.filter((param) => !req.body[param]);
    if (missingParams.length > 0) {
      return res
        .status(400)
        .send(`Missing required parameters: ${missingParams.join(", ")}`);
    }
    // Validate first and last names are not empty
    if (!req.body.firstName || !req.body.lastName || !req.body.phoneNumber) {
      return res
        .status(400)
        .send("First name, last name, or phone number cannot be empty.");
    }
    try {
      const { email, password } = req.body;
      if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      if (!password || password.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }
      if (
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
      ) {
        return res.status(400).json({
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        });
      }
      const saved = await Mongo.save_user(req.body);
      if (saved.status === 400) {
        return res.status(saved.status).json(saved.message);
      }
      res.status(saved.status).json(saved.message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async log_in(req, res) {
    const required_params = ["email", "password"];
    // Check if the body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("Request body cannot be empty!");
    }
    // Check if req.body contains any unexpected parameters
    const unexpectedParams = Object.keys(req.body).filter(
      (key) => !required_params.includes(key)
    );
    if (unexpectedParams.length > 0) {
      return res
        .status(400)
        .send(`Unexpected parameters: ${unexpectedParams.join(", ")}`);
    }
    // Check if all required parameters are present
    const missingParams = required_params.filter((param) => !req.body[param]);
    if (missingParams.length > 0) {
      return res
        .status(400)
        .send(`Missing required parameters: ${missingParams.join(", ")}`);
    }
    const { email, password } = req.body;
    console.log(req.body);
    const user_id = await Mongo.validate(email, password);
    if (!user_id) {
      return res.status(404).send("User not found! or Invalid Password!");
    }
    const sessionId = uuidv4();
    try {
      await redis_class.create_session(sessionId, user_id);
    } catch (error) {
      console.log(error);
    }
    res.cookie("sessionId", `session:${sessionId}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
    });
    res
      .status(200)
      .json({ sessionId: sessionId, message: "Login successful!" });
  }

  static get_sessionId(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        status: 401,
        json: { message: "Authorization header is missing or invalid." },
      };
    }

    const sessionId = authHeader.split(" ")[1];
    return { status: 200, json: { sessionId: [sessionId] } };
  }

  static async log_out(req, res) {
    // const sessionId = req.params.sessionId;
    const auth = UserController.get_sessionId(req);
    if (auth.status !== 200) {
      return res.status(auth.status).json(auth.json);
    }
    const sessionId = auth.json.sessionId[0];
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required." });
    }
    // try {
    const status = await redis_class.delete_session(`session:${sessionId}`);
    if (!status) {
      return res.status(404).json({ message: "Session not found." });
    }
    res.status(200).json({ message: "Logged out successfully." });
  }

  static async bid(req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("req body cannot be empty!");
    }
    // no bidder: userId because sessionId must be present
    // no amount: because the amount will be bidIncrement
    const required_params = ["auctionId"];
    // Check if required parameters are present
    const missingParams = required_params.filter((param) => !req.body[param]);
    if (missingParams.length > 0) {
      return res
        .status(400)
        .send(`Missing required parameters: ${missingParams.join(", ")}`);
    }
    // Check if req.body contains any unexpected parameters
    const unexpectedParams = Object.keys(req.body).filter(
      (key) => !required_params.includes(key)
    );
    if (unexpectedParams.length > 0) {
      return res
        .status(400)
        .send(`Unexpected parameters: ${unexpectedParams.join(", ")}`);
    }
    // Validate auctionId is not empty
    if (!req.body.auctionId) {
      return res.status(400).json({ error: "Invalid auction ID" });
    }
    const { auctionId } = req.body;
    const auction = await Mongo.get_auction(
      auctionId.split("@")[0],
      auctionId.split("@")[1]
    );
    if (!auction) {
      return res.status(404).json({ message: "Auction not found." });
    }
    if (auction.status !== "ongoing") {
      return res.status(400).json({
        message: "Auction is not ongoing. Bidding is not allowed.",
      });
    }
    if (new Date(auction.endDate) < new Date()) {
      return res.status(400).json({
        message: "Auction has already ended. Bidding is not allowed.",
      });
    }
    const auth = UserController.get_sessionId(req);
    if (auth.status !== 200) {
      return res.status(auth.status).json(auth.json);
    }
    const userId = await redis_class.get_session(auth.json.sessionId[0]);
    const bid = new bids_model({
      _id: uuidv4(), // Unique bid ID
      auctionId: auctionId,
      bidder: userId,
      amount: auction.bidIncrement,
    });
    await redis_class.bid_on_auction(bid, auction.endDate);
    res.status(200).json({
      message: "Bid placed successfully!",
    });
  }
  static async auction_list(req, res) {
    const allowed_params = ["status"];
    // Check if req.body contains any unexpected parameters
    const unexpectedParams = Object.keys(req.body).filter(
      (key) => !allowed_params.includes(key)
    );

    if (unexpectedParams.length > 0) {
      return res
        .status(400)
        .send(`Unexpected parameters: ${unexpectedParams.join(", ")}`);
    }
    // Check if status is a valid value
    if (
      req.body.status &&
      !["upcoming", "ongoing", "ended"].includes(req.body.status)
    ) {
      return res
        .status(400)
        .send("Status must be one of: upcoming, ongoing, ended");
    }
    // Fetch auctions based on the status if provided
    const auctions = await Mongo.auction_list_mongo(req.body.status);

    if (auctions.length === 0) {
      return res.status(404).send("No auctions found for the given status");
    }
    res.send({ message: "Success", item: auctions });
  }
  // static async bid(req, res) {
  //   const { auctionId, bidder, amount } = req.body;

  //   if (!auctionId || !bidder || !amount) {
  //     return res.status(400).json({
  //       message: "All fields (auctionId, bidder, amount) are required.",
  //     });
  //   }

  //   try {
  //     // Mongo.save_bid(req.body);
  //     // mqttClient.publish(Mongo.get_auction(auctionId), String(amount));

  //     // Respond with the bid data
  //     res.status(201).json({
  //       message: "Bid placed successfully!",
  //     });
  //   } catch (error) {
  //     console.error("Error creating bid:", error);
  //     res.status(500).json({ message: "Error placing bid." });
  //   }
  // }

  //   static async listen_on_auction(req, res) {
  //     const { auctionId, userId } = req.params;

  //     if (!auctionId || !userId) {
  //       return res
  //         .status(400)
  //         .json({ message: "Auction ID and User ID are required." });
  //     }

  //     try {
  //       mqttClient.on("connect", () => {
  //         console.log(`User ${userId} is subscribing to auction ${auctionId}`);
  //         mqttClient.subscribe(Mongo.get_auction(auctionId), (err) => {
  //           if (err) {
  //             console.error("Failed to subscribe to auction bids:", err);
  //             return res
  //               .status(500)
  //               .json({ message: "Failed to subscribe to auction bids." });
  //           }
  //           console.log(`User ${userId} subscribed to auction ${auctionId}/bids`);
  //           return res.status(200).json({
  //             message: `Subscribed to auction ${Mongo.get_auction(
  //               auctionId
  //             )} bid updates.`,
  //           });
  //         });
  //       });
  //       mqttClient.on("message", (topic, message) => {
  //         if (topic === `auction/${auctionId}/bids`) {
  //           const bidData = JSON.parse(message.toString());
  //           console.log(`New bid update for auction ${auctionId}:`, bidData);
  //           redis_class.conn();
  //           redis_class.client.set(
  //             `auction:${auctionId}:latestBid`,
  //             JSON.stringify(bidData)
  //           );
  //         }
  //       });
  //     } catch (error) {
  //       console.error("Error subscribing to auction:", error);
  //       return res
  //         .status(500)
  //         .json({ message: "Error subscribing to auction updates." });
  //     }
  //   }
  // }
}
