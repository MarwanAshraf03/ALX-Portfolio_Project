import mongoose from "mongoose";

export default class Mongo {
  // MongoDB connection URL (replace with your own if necessary)
  static mongoURI = "mongodb://mongo:27017/mydatabase";

  // Connect to MongoDB
  static async connect(request, response) {
    await mongoose.connect(Mongo.mongoURI);

    // Event listeners for MongoDB connection
    const db = mongoose.connection;
    db.on("error", (err) => console.error("MongoDB connection error:", err));
    db.once("open", () => console.log("Connected to MongoDB"));

    response.send();
    // Create a simple schema and model
    // const itemSchema = new mongoose.Schema({
    //   name: String,
    //   price: Number,
    // });

    // console.log(request.body);

    // const Item = mongoose.model("Item", itemSchema);

    // const { name, price } = request.body;

    // const newItem = new Item({ name, price });
    // await newItem.save();

    // console.log({ message: "Item added successfully", item: newItem });

    // const items = await Item.find();
    // res.send(items);
  }
}
