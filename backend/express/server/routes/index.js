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
router.get("/", AdminController.getAuctionActiviy);

router.post("/create_auction", AdminController.createAuction);
router.get("/auction_list", AdminController.get_all_auction);

router.get("/mos-conn/", Mosquitto.connect);

router.get("/red-conn/", redis_class.conn);

router.post("/mongo-conn/", Mongo.connect);

router.get("/students", StudentsController.getAllStudents);

router.get("/students/:major", StudentsController.getAllStudentsByMajor);

export default router;
