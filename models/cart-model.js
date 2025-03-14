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
    return result.recordset || [];
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
        { name: "date", value: moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss") }
    ];

    const query = `INSERT INTO cart (invt_id, descr, uom, quantity, empId, date) 
          VALUES (@invt_id, @descr, @uom, @quantity, @empId, @date) `;

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

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("empId", sql.NVarChar, empId)
      .query(`SELECT * FROM cart WHERE empId = @empId`);

    return result.recordset;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// export const removeCartItem = async (empId, invt_id, uom) => {
//   const pool = await poolPromise;
//   return await pool
//     .request()
//     .input("empId", sql.NVarChar, empId)
//     .input("invt_id", sql.NVarChar, invt_id)
//     .input("uom", sql.NVarChar, uom)
//     .query(
//       "DELETE FROM cart WHERE empId = @empId AND invt_id = @invt_id AND uom = @uom"
//     );
// };
