import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // when run local server
// import pkg from "uuid"; // when run containerized server
// const { v4: uuidv4 } = pkg; // when run containerized server
// uuid for admin: 1cb30c0f-630e-4079-8f97-f2eb93a89762
const itemSchema = new Schema({
  name: String,
  price: Number,
});

const users = new Schema({
  _id: { type: String, default: () => uuidv4() },
  username: String,
  email: String,
  password: String,
  phoneNumber: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  profile: {
    fullName: String,
    avatarUrl: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const auctions = new Schema({
  _id: { type: String, default: () => uuidv4() },
  title: String,
  description: String,
  imageUrl: String,
  startingPrice: Number,
  currentPrice: Number,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  createdBy: { type: String, default: () => uuidv4() },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "ended"],
    default: "upcoming",
  },
  bidIncrement: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const bids = new Schema({
  _id: { type: String, default: () => uuidv4() }, // Unique bid ID
  // auctionId: { type: String, default: () => uuidv4() }, // Reference to `Auctions._id`
  // bidder: { type: String, default: () => uuidv4() }, // Reference to `Users._id`
  auctionId: { type: String }, // Reference to `Auctions._id`
  bidder: { type: String }, // Reference to `Users._id`
  amount: Number,
  placedAt: { type: Date, default: Date.now },
});

const auction_list = new Schema({
  // auctions: [
  // {
  _id: { type: String, default: () => uuidv4() },

  title: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "ended"],
    default: "upcoming",
  },
  // },
  // ],
});

// const sessions = new Schema({
//   _id: String, // Session ID
//   userId: {type:String, default: () => uuidv4()}, // Reference to `Users._id`
//   createdAt: { type: Date, default: Date.now },
//   expiresAt: Date, // Expiry time for the session
//   data: Object, // Additional session data, if needed
// });

// const notification = new Schema({
//   _id: {type:String, default: () => uuidv4()}, // notificationification ID
//   userId: {type:String, default: () => uuidv4()}, // Reference to `Users._id`
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
