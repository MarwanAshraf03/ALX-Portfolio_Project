import express from "express";
import AdminController from "../controllers/admin.js";
import UserController from "../controllers/user.js";

const router = express.Router();
// Admin routes
router.get("/", AdminController.getAuctionActiviy);
router.post("/create_auction", AdminController.createAuction);
router.get("/auction_list", AdminController.get_all_auction);
router.get("/users_list", AdminController.list_users);

// User routes
router.post("/sign_in", UserController.sign_in);
router.get("/log_in", UserController.loginUser);
router.post("/bid", UserController.bid);
router.get("/listen_on_auction", UserController.listen_on_auction);

export default router;
