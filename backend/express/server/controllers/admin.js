import Mosquitto from "../models/mosquitto.js";
import Mongo from "../models/mongo.js";
import { v4 as uuidv4 } from "uuid"; // when run local server
import { startSession } from "mongoose";
// import pkg from "uuid"; // when run containerized server
// const { v4: uuidv4 } = pkg; // when run containerized server
export default class AdminController {
  static count = 0;

  static async get_auction_activity(request, response) {
    Mongo.connect();
    response.json({ message: uuidv4() });
    // response.send()
    // try {
    //   const auctions = await Mongo.auction_list();
    //   const activity = auctions.map((auction) => ({
    //     title: auction.title,
    //     startDate: auction.startDate,
    //     endDate: auction.endDate,
    //     status: auction.status,
    //   }));
    //   response.status(200).json({ activity });
    // } catch (error) {
    //   console.error("Error fetching auction activity:", error);
    //   response
    //     .status(500)
    //     .json({ message: "Failed to fetch auction activity." });
    // }
  }

  static async create_auction(request, response) {
    // Check if the body is empty
    if (Object.keys(request.body).length === 0) {
      console.log(request.body);
      return response.status(400).send("request body cannot be empty!");
    }
    const required_params = [
      "title",
      "startingPrice",
      "endDate",
      "bidIncrement",
    ];
    // Check if required parameters are present
    const missingParams = required_params.filter(
      (param) => !request.body[param]
    );
    if (missingParams.length > 0) {
      return response
        .status(400)
        .send(`Missing required parameters: ${missingParams.join(", ")}`);
    }

    const not_required_params = [
      "startDate",
      "imageUrl",
      "description",
      "createdBy",
      "status",
    ];

    for (const param of not_required_params) {
      if (request.body[param]) {
        not_required_params[param] = request.body[param];
      }
    }
    // Check if request.body contains any unexpected parameters
    const allParams = [...required_params, ...not_required_params];
    const unexpectedParams = Object.keys(request.body).filter(
      (key) => !allParams.includes(key)
    );

    if (unexpectedParams.length > 0) {
      return response
        .status(400)
        .send(`Unexpected parameters: ${unexpectedParams.join(", ")}`);
    }
    // Convert startingPrice and bidIncrement to numbers
    request.body.startingPrice = parseFloat(request.body.startingPrice);
    request.body.bidIncrement = parseFloat(request.body.bidIncrement);
    // Ensure they are valid numbers
    if (isNaN(request.body.startingPrice)) {
      return response.status(400).send("Starting Price must be a valid number");
    }
    if (isNaN(request.body.bidIncrement)) {
      return response.status(400).send("Bid Increment must be a valid number");
    }
    // Check if startingPrice is greater than 0
    if (request.body.startingPrice <= 0) {
      return response.status(400).send("Starting Price must be greater than 0");
    }
    // Check if bidIncrement is greater than 0
    if (request.body.bidIncrement <= 0) {
      return response.status(400).send("Bid Increment must be greater than 0");
    }
    // Check if endDate is a valid date string
    const endDate = new Date(request.body.endDate);
    if (isNaN(endDate.getTime())) {
      return response
        .status(400)
        .send("Ending Date must be a valid date string");
    }
    // Check if startDate is a valid date string
    const startDate = request.body.startDate
      ? new Date(request.body.startDate)
      : new Date();
    request.body.startDate = startDate;
    // if (startDate !== 0)
    if (isNaN(startDate.getTime())) {
      return response
        .status(400)
        .send("Starting Date must be a valid date string");
    }
    // Ensure startDate is not more than 3 months in advance
    const now = new Date();
    const maxStartDate = new Date();

    if (startDate < now) {
      return response.status(400).send("Starting Date cannot be in the past");
    }

    maxStartDate.setMonth(now.getMonth() + 3);
    if (startDate > maxStartDate) {
      return response
        .status(400)
        .send("Starting Date cannot be more than 3 months in advance");
    }
    // Ensure endDate is not more than 3 months after startDate
    const maxEndDate = new Date(startDate);

    maxEndDate.setMonth(startDate.getMonth() + 3);
    if (endDate > maxEndDate) {
      return response
        .status(400)
        .send("Ending Date cannot be more than 3 months after startDate");
    }
    // Check if startDate is before endDate
    if (startDate >= endDate) {
      return response.status(400).send("Starting Date must be before endDate");
    }
    // Determine the status based on startDate and endDate
    if (now < startDate) {
      request.body.status = "upcoming";
    } else if (now >= startDate && now <= endDate) {
      request.body.status = "ongoing";
    } else {
      request.body.status = "ended";
    }
    const ret = await Mongo.save_auction(request.body);
    return response.status(ret.status).json(ret.message);
  }

  static async update_auction(request, response) {
    // Check if the body is empty
    if (Object.keys(request.body).length === 0) {
      return response.status(400).send("request body cannot be empty!");
    }
    const allowed_params = ["endDate", "imageUrl", "description"];
    const required_params = ["createdBy", "title"];
    // Check if required parameters are present
    const missingParams = required_params.filter(
      (param) => !request.body[param]
    );
    if (missingParams.length > 0) {
      return response
        .status(400)
        .send(`Missing required parameters: ${missingParams.join(", ")}`);
    }
    const auction_data = await Mongo.get_auction(
      request.body.title,
      request.body.createdBy
    );
    if (!auction_data) {
      return response.status(404).send("Auction not found");
    }
    // Check if request.body contains any unexpected parameters
    const allParams = [...required_params, ...allowed_params];
    const unexpectedParams = Object.keys(request.body).filter(
      (key) => !allParams.includes(key)
    );

    if (unexpectedParams.length > 0) {
      return response
        .status(400)
        .send(`Unexpected parameters: ${unexpectedParams.join(", ")}`);
    }
    if (request.body.endDate) {
      const endDate = new Date(request.body.endDate);
      if (isNaN(endDate.getTime())) {
        return response
          .status(400)
          .send("Ending Date must be a valid date string");
      }
      // Ensure endDate is not more than 3 months after startDate
      const maxEndDate = new Date(auction_data.startDate);
      maxEndDate.setMonth(auction_data.startDate.getMonth() + 3);
      if (endDate > maxEndDate) {
        return response
          .status(400)
          .send("Ending Date cannot be more than 3 months after startDate");
      }
      // Check if endDate is before startDate
      if (endDate < auction_data.startDate) {
        return response.status(400).send("Ending Date must be after startDate");
      }
      const now = new Date();
      if (now < auction_data.startDate) {
        request.body.status = "upcoming";
      } else if (now >= auction_data.startDate && now <= endDate) {
        request.body.status = "ongoing";
      } else {
        request.body.status = "ended";
      }
    }

    const ret = await Mongo.update_auction(request.body);
    response.send({ message: "Item updated successfully", item: ret });
  }

  static async auction_list(request, response) {
    const allowed_params = ["status"];

    // if (Object.keys(request.body).length === 0) {
    //   return response.status(400).send("request body cannot be empty!");
    // }
    // Check if request.body contains any unexpected parameters
    const unexpectedParams = Object.keys(request.body).filter(
      (key) => !allowed_params.includes(key)
    );

    if (unexpectedParams.length > 0) {
      return response
        .status(400)
        .send(`Unexpected parameters: ${unexpectedParams.join(", ")}`);
    }
    // Check if status is a valid value
    if (
      request.body.status &&
      !["upcoming", "ongoing", "ended"].includes(request.body.status)
    ) {
      return response
        .status(400)
        .send("Status must be one of: upcoming, ongoing, ended");
    }
    // Fetch auctions based on the status if provided
    // if (request.body.status) {
    const auctions = await Mongo.auction_list_mongo(request.body.status);

    if (auctions.length === 0) {
      return response
        .status(404)
        .send("No auctions found for the given status");
    }
    response.send({ message: "Success", item: auctions });
    // return response.send(auctions);
    // }else {
    // If no status is provided, fetch all auctions
    // const auctions = await Mongo.auction_list_mongo();

    // if (auctions.length === 0) {
    //   return response.status(404).send("No auctions found");
    // }
    // }
  }
  // static config_auction(request, response) {
  //   response.send("hello world");
  // }
  // static async list_users(request, response) {
  //   response.send({ message: "list of users", list: await Mongo.users_list() });
  // }
}
