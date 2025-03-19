import express from "express";
import { getOrderLines_Cont, getOrders_Cont, handleCheckout_Cont } from "../controllers/order-controller.js";





const router = express.Router();

router.post("/checkout", handleCheckout_Cont)
router.get("/orders", getOrders_Cont)
router.get("/order-lines", getOrderLines_Cont);
export default router;