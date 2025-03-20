import { poolPromise } from "../utils/utils.js";
import sql from "mssql";
import moment from "moment-timezone";

// ✅ General Query Execution Function
export const executeQuery = async (query, inputParameters = []) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    inputParameters.forEach((param) => {
      request.input(param.name, param.value);
    });

    const result = await request.query(query);
    return result;
  } catch (err) {
    console.error("executeQuery Error:", err);
    throw err;
  }
};

// ✅ Insert Item into Cart
export const insertCartItem = async (cartItem) => {
  try {
    const { invt_id, descr, uom, quantity, empId } = cartItem;

    if (!invt_id || !descr || !uom || !quantity || !empId) {
      throw new Error("Missing required fields");
    }

    const params = [
      { name: "invt_id", value: invt_id },
      { name: "descr", value: descr },
      { name: "uom", value: uom },
      { name: "quantity", value: quantity },
      { name: "empId", value: empId },
      { name: "date", value: moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss") },
    ];

    const query = `INSERT INTO cart (invt_id, descr, uom, quantity, empId, date) 
                   VALUES (@invt_id, @descr, @uom, @quantity, @empId, @date)`;

    await executeQuery(query, params);
    return { success: true, message: "Item added to cart" };
  } catch (error) {
    console.error("Error inserting cart item:", error);
    throw error;
  }
};

// ✅ Fetch Cart Items for a Specific EMPID
export const getCartByEmpId = async (empId) => {
  try {
    if (!empId) throw new Error("EMPID is required");

    const query = `SELECT * FROM cart WHERE empId = @empId`;
    const params = [{ name: "empId", value: empId }];

    const result = await executeQuery(query, params);

    return result?.recordset || [];
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// ✅ Remove a Specific Cart Item
export const removeCartItem = async (empId, invt_id, uom) => {
  try {
    const query = `
      DELETE FROM cart
      WHERE empId = @empId AND invt_id = @invt_id AND uom = @uom
    `;
    const params = [
      { name: "empId", value: empId },
      { name: "invt_id", value: invt_id },
      { name: "uom", value: uom },
    ];

    // Return the full DB result
    return await executeQuery(query, params);
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

// ✅ Remove All Cart Items for a Specific EMPID
export const removeCartAll = async (empId) => {
  try {
    const query = `DELETE FROM cart WHERE empId = @empId`;
    const params = [{ name: "empId", value: empId }];

  return await executeQuery(query, params);

  } catch (error) {
    console.error("Error removing all cart items:", error);
    throw error;
  }
};

export const UpdateCart = async (empId, invt_id, uom, quantity) => {
  try {
    const query = `
      UPDATE cart
      SET quantity = @quantity
      WHERE empId = @empId AND invt_id = @invt_id AND uom = @uom
    `;
    const params = [
      { name: "empId", value: empId },
      { name: "invt_id", value: invt_id },
      { name: "uom", value: uom },
      { name: "quantity", value: quantity },
    ];
    return await executeQuery(query, params);
  } catch (error) {
    throw error;
  }
};