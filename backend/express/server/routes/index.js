import express from "express";
import AdminController from "../controllers/admin.js";
import UserController from "../controllers/user.js";

const router = express.Router();
// Admin routes
// done
router.post("/create_auction", AdminController.create_auction);
router.post("/update_auction", AdminController.update_auction);
router.get("/auction_list", AdminController.auction_list);
// still
router.get("/", AdminController.get_auction_activity);
// router.get("/users_list", AdminController.list_users);

// User routes
// done
router.post("/sign_in", UserController.sign_in);
router.post("/log_in", UserController.log_in);
router.post("/log_out", UserController.log_out);
// still
router.post("/bid", UserController.bid);
// router.get("/listen_on_auction", UserController.listen_on_auction);

export default router;
