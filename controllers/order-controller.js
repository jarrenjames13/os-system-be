import { checkoutCart } from "../models/orders-model";

export const HandleCheckout = async (req, res) => {
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