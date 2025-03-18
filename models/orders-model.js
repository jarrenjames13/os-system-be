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

// ✅ Function to Generate Unique Reference Number
const getNextSequence = (lastRef) => {
    if (!lastRef) return null; // First order of the day (no sequence needed)
  
    const lastSeq = lastRef.slice(-2); // Get last two letters
    if (lastSeq === "ZZ") return "ZZ"; // Prevent overflow
  
    let firstChar = lastSeq.charAt(0);
    let secondChar = lastSeq.charAt(1);
  
    if (secondChar === "Z") {
      firstChar = String.fromCharCode(firstChar.charCodeAt(0) + 1);
      secondChar = "A";
    } else {
      secondChar = String.fromCharCode(secondChar.charCodeAt(0) + 1);
    }
  
    return `${firstChar}${secondChar}`;
  };
  
  // ✅ Generate Unique Reference Number
  export const generateRefNum = async (empId) => {
    const today = moment().tz("Asia/Manila");
    const dateStr = today.format("YYMMDD");
    const last3EmpId = empId.slice(-3);
  
    const query = `
      SELECT TOP 1 refNum FROM orders 
      WHERE empId = @empId AND refNum LIKE @prefix 
      ORDER BY refNum DESC
    `;
  
    const result = await executeQuery(query, [
      { name: "empId", value: empId },
      { name: "prefix", value: `${dateStr}%` }, // Match any order from today
    ]);
  
    const lastRefNum = result.length ? result[0].refNum : null;
    const newSequence = getNextSequence(lastRefNum);
  
    return newSequence ? `${dateStr}${last3EmpId}${newSequence}` : `${dateStr}${empId}`;
  };
  

  // ✅ Checkout Selected Items
export const checkoutCart = async (empId, selectedItems) => {
    try {
      if (!empId || !selectedItems || selectedItems.length === 0) {
        throw new Error("Invalid checkout request.");
      }
  
      const refNum = await generateRefNum(empId);
      const date = moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss");
  
      // Insert selected cart items into the `orders` table
      const insertQueries = selectedItems.map((item) => {
        return executeQuery(
          `
            INSERT INTO orders (date, empId, invt_id, descr, uom, quantity, status, refNum) 
            VALUES (@date, @empId, @invt_id, @descr, @uom, @quantity, @status, @refNum)
          `,
          [
            { name: "date", value: date },
            { name: "empId", value: empId },
            { name: "invt_id", value: item.invt_id },
            { name: "descr", value: item.descr },
            { name: "uom", value: item.uom },
            { name: "quantity", value: item.quantity },
            { name: "status", value: "Pending" },
            { name: "refNum", value: refNum },
          ]
        );
      });
  
      await Promise.all(insertQueries);
  
      // Remove selected items from the cart
      const deleteQueries = selectedItems.map((item) => {
        return executeQuery(
          "DELETE FROM cart WHERE empId = @empId AND invt_id = @invt_id AND uom = @uom",
          [
            { name: "empId", value: empId },
            { name: "invt_id", value: item.invt_id },
            { name: "uom", value: item.uom },
          ]
        );
      });
  
      await Promise.all(deleteQueries);
  
      return { success: true, refNum };
    } catch (error) {
      console.error("Error in checkout:", error);
      throw error;
    }
  };