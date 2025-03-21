import { checkoutCart, getAllOrderLines, getAllOrders, getOrderLines, GetOrders, UpdateOrderStatus, getOrdersByStatus, getOrdersByStatusAndEmpId } from "../models/orders-model.js";

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

// export const getAllOrders_Cont = async (req, res) => {
//   try {
//     const orders = await getAllOrders();
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// Get all order lines
export const getAllOrderLines_Cont = async (req, res) => {
  try {
    const orderLines = await getAllOrderLines();
    res.status(200).json(orderLines);
  } catch (error) {
    console.error("Error fetching order lines:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus_Cont = async (req, res) => {
  try {
    const { refNum, status } = req.body;

    if (!refNum || !status) {
      return res.status(400).json({ success: false, message: "Invalid request." });
    }

    const result = await UpdateOrderStatus(refNum, status);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getOrdersByStatus_Cont = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const statusArray = status.split(",");
    const orders = await getOrdersByStatus(statusArray);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrdersByStatusAndEmpid_Cont = async (req, res) => {
  try {
    const { status, empId } = req.query;

    if (!status || !empId) {
      return res.status(400).json({ success: false, message: "Status and EMPID are required." });
    }

    const statusArray = status.split(",");
    const orders = await getOrdersByStatusAndEmpId(statusArray, empId);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders by status and empId:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
