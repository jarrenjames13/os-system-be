import { checkoutCart, getOrderLines, GetOrders } from "../models/orders-model.js";


export const handleCheckout_Cont = async (req, res) => {
  
    try {
      const { empId, selectedItems } = req.body;
  
      if (!empId || !selectedItems || selectedItems.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid checkout request." });
      }
  
      // Execute checkout process
      const result = await checkoutCart(empId, selectedItems);
  
      if (result.success) {
        return res.status(201).json({ success: true, message: "Checkout successful.", refNum: result.refNum });
      } else {
        throw new Error("Failed to complete checkout.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  };

  export const getOrders_Cont = async (req, res) => {
    try {
  
      const { refNum } = req.query;
  
      if (!refNum) {
        return res.status(200).json({ success: false, message: "Missing Reference Number" });
      }
  
      const orderItems = await GetOrders(refNum);
      res.status(200).json(orderItems);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const getOrderLines_Cont = async (req, res) => {
    try {
      const { empId } = req.query;
      if (!empId) {
        return res.status(200).json({ success: false, message: "Missing EMPID" });
      }
  
      const orderLines = await getOrderLines(empId);
      res.status(200).json({ success: true, orderLines });
    } catch (error) {
      console.error("Error fetching order lines:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };