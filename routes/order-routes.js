import express from "express";
import { getOrderLines_Cont, getOrders_Cont, handleCheckout_Cont,  getAllOrderLines_Cont, updateOrderStatus_Cont, getOrdersByStatus_Cont, getOrdersByStatusAndEmpid_Cont } from "../controllers/order-controller.js";
// getAllOrders_Cont,
const router = express.Router();

router.post("/checkout", handleCheckout_Cont);
router.get("/orders", getOrders_Cont);
router.get("/order-lines", getOrderLines_Cont);
// router.get("/all-orders", getAllOrders_Cont);
router.get("/all-order-lines", getAllOrderLines_Cont);
router.patch("/update-order-status", updateOrderStatus_Cont);
router.get("/orders-by-status", getOrdersByStatus_Cont); //
router.get("/orders-by-status-empid", getOrdersByStatusAndEmpid_Cont); //

export default router;