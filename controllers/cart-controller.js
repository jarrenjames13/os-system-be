import { insertCartItem, getCartByEmpId,  } from "../models/cart-model.js";
//  
import moment from "moment";

// ✅ Controller to Add Item to Cart
export const addToCart = async (req, res) => {
    try {
      const { empId, invt_id, descr, uom, quantity } = req.body;
  
      if (!empId || !invt_id || !descr || !uom || !quantity) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      // Check if the item is already in the cart
      const cartItems = await getCartByEmpId(empId);
      const itemExists = cartItems.some(item => item.invt_id === invt_id && item.uom === uom);
  
      if (itemExists) {
        return res.status(200).json({ success: false, message: "Item is already in cart" }); 
      }
  
      const date = moment().format("YYYY-MM-DD HH:mm:ss");
  
      // ✅ Use Model Function for Insertion
      const result = await insertCartItem({ empId, invt_id, descr, uom, quantity, date });
  
      if (result.success) {
        return res.status(201).json({ success: true, message: "Item added to cart" });
      } else {
        throw new Error("Failed to insert cart item.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

// ✅ Controller to Fetch Cart Items by EMPID
export const getCartItems = async (req, res) => {
  try {

    const { empId } = req.query;

    if (!empId) {
      return res.status(400).json({ success: false, message: "Missing EMPID" });
    }

    const cartItems = await getCartByEmpId(empId);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// export const deleteCartItem = async (req, res) => {
//   try {
//     const { empId, invt_id, uom } = req.query;

//     if (!empId || !invt_id || !uom) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const result = await removeCartItem(empId, invt_id, uom);
    
//     if (result.rowsAffected[0] > 0) {
//       res.status(200).json({ success: true, message: "Item removed from cart" });
//     } else {
//       res.status(404).json({ success: false, message: "Item not found in cart" });
//     }
//   } catch (error) {
//     console.error("Error removing cart item:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

