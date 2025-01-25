import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  name: String,
  price: Number,
});

const users = new Schema({
  _id: ObjectId, // Unique user ID
  username: String, // Unique username
  email: String, // Unique email
  password: String, // Hashed password
  phoneNumber: String, // phone number
  role: { type: String, enum: ["admin", "user"], default: "user" },
  //   isBanned: { type: Boolean, default: false },
  //   mfaEnabled: { type: Boolean, default: false },
  //   mfaSecret: String, // Optional, for MFA
  profile: {
    fullName: String,
    avatarUrl: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const auction_list = new Schema({
  auctions: [
    {
      name: String,
      start_at: Date,
      end_at: Date,
    },
  ],
});
const auctions = new Schema({
  _id: ObjectId, // Unique auction ID
  title: String,
  description: String,
  imageUrl: String, // URL to the auction item image
  startingPrice: Number,
  currentPrice: Number, // Updated dynamically
  startDate: Date,
  endDate: Date,
  createdBy: ObjectId, // Reference to `Users._id`
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "ended"],
    default: "upcoming",
  },
  bids: [
    // Embedded bid history
    {
      bidder: ObjectId, // Reference to `Users._id`
      amount: Number,
      placedAt: Date,
    },
  ],
  bidIncrement: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const bids = new Schema({
  _id: ObjectId, // Unique bid ID
  auctionId: ObjectId, // Reference to `Auctions._id`
  bidder: ObjectId, // Reference to `Users._id`
  amount: Number,
  placedAt: { type: Date, default: Date.now },
});

// const sessions = new Schema({
//   _id: String, // Session ID
//   userId: ObjectId, // Reference to `Users._id`
//   createdAt: { type: Date, default: Date.now },
//   expiresAt: Date, // Expiry time for the session
//   data: Object, // Additional session data, if needed
// });

// const notification = new Schema({
//   _id: ObjectId, // notificationification ID
//   userId: ObjectId, // Reference to `Users._id`
//   type: {
//     type: String,
//     enum: ["bid_update", "auction_update", "system_alert"],
//   },
//   message: String,
//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
// });

export const Item = model("Item", itemSchema);
export const users_model = model("users", users);
export const auctions_model = model("auctions", auctions);
export const auction_list_model = model("auction_list", auction_list);
export const bids_model = model("bids", bids);
// export const sessions_model = model("sessions", sessions);
// export const notification_model = model("notification", notification);
