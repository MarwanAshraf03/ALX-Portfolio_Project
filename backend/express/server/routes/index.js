import express from "express";
// import { AdminController } from '../controllers/AdminController';
// import { StudentsController } from '../controllers/StudentsController';
import AdminController from "../controllers/admin.js";
import StudentsController from "../controllers/user.js";
import Mosquitto from "../models/mosquitto.js";
import redis_class from "../models/redis.js";
import Mongo from "../models/mongo.js";
// import { AdminController } from "../controllers/admin";

const router = express.Router();
// Route for the homepage
router.get("/", AdminController.getAuctionActiviy);

router.post("/create_auction", AdminController.createAuction);

// Route for the homepage
router.get("/mos-conn/", Mosquitto.connect);

// Route for the homepage
router.get("/red-conn/", redis_class.conn);

// Route for the homepage
router.post("/mongo-conn/", Mongo.connect);

// Route for all students
router.get("/students", StudentsController.getAllStudents);

// Route for students by major
router.get("/students/:major", StudentsController.getAllStudentsByMajor);

export default router;
