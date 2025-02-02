import Mongo from "../models/mongo.js";
import validator from "validator";
import { v4 as uuidv4 } from "uuid"; // when run local server
// import pkg from "uuid"; // when run containerized server
// const { v4: uuidv4 } = pkg; // when run containerized server

export default class UserController {
  static async sign_in(req, res) {
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
      const stats = await Mongo.save_user(req.body);
      if (stats === 400) {
        return res.status(400).json({ error: "Email already in use" });
      }
      res
        .status(201)
        .json({ message: "User created successfully", user: stats });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async loginUser(req, res) {
    const { email, password } = req.body;
    const isValid = Mongo.validate(email, password);
    if (!isValid) {
      return res.status(404).send("User not found! or Invalid Password!");
    }
    const sessionId = uuidv4();
    await redisClient.set(`session:${sessionId}`, email, { EX: 3600 }); // Session expires in 1 hour

    res.status(200).json({ sessionId, message: "Login successful!" });
  }
  static async bid(req, res) {
    const { auctionId, bidder, amount } = req.body;

    if (!auctionId || !bidder || !amount) {
      return res.status(400).json({
        message: "All fields (auctionId, bidder, amount) are required.",
      });
    }

    try {
      Mongo.save_bid(req.body);
      mqttClient.publish(Mongo.get_auction(auctionId), String(amount));

      // Respond with the bid data
      res.status(201).json({
        message: "Bid placed successfully!",
      });
    } catch (error) {
      console.error("Error creating bid:", error);
      res.status(500).json({ message: "Error placing bid." });
    }
  }

  static async listen_on_auction(req, res) {
    const { auctionId, userId } = req.params;

    if (!auctionId || !userId) {
      return res
        .status(400)
        .json({ message: "Auction ID and User ID are required." });
    }

    try {
      mqttClient.on("connect", () => {
        console.log(`User ${userId} is subscribing to auction ${auctionId}`);
        mqttClient.subscribe(Mongo.get_auction(auctionId), (err) => {
          if (err) {
            console.error("Failed to subscribe to auction bids:", err);
            return res
              .status(500)
              .json({ message: "Failed to subscribe to auction bids." });
          }
          console.log(`User ${userId} subscribed to auction ${auctionId}/bids`);
          return res.status(200).json({
            message: `Subscribed to auction ${Mongo.get_auction(
              auctionId
            )} bid updates.`,
          });
        });
      });
      mqttClient.on("message", (topic, message) => {
        if (topic === `auction/${auctionId}/bids`) {
          const bidData = JSON.parse(message.toString());
          console.log(`New bid update for auction ${auctionId}:`, bidData);
          redisClient.set(
            `auction:${auctionId}:latestBid`,
            JSON.stringify(bidData)
          );
        }
      });
    } catch (error) {
      console.error("Error subscribing to auction:", error);
      return res
        .status(500)
        .json({ message: "Error subscribing to auction updates." });
    }
  }
}
