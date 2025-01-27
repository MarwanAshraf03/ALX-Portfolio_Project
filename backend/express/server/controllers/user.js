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
}
