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


// ✅ Function to Generate Next Sequence (AA, AB, AC... ZZ)
const getNextSequence = (lastRef, baseRef) => {
  if (!lastRef || lastRef === baseRef) return "AA"; // First order of the day is just YYMMDD+EMPID

  const lastSeq = lastRef.slice(-2); // Extract last two characters (sequence)
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
  const baseRef = `${dateStr}${empId}`; // First order of the day format

  try {
    // Lock only rows related to this EMPID to prevent duplicate sequences
    const query = `
      SELECT TOP 1 refNum FROM orders WITH (UPDLOCK, ROWLOCK, HOLDLOCK)
      WHERE empId = @empId AND refNum LIKE @prefix
      ORDER BY refNum DESC
    `;

    const result = await executeQuery(query, [
      { name: "empId", value: empId },
      { name: "prefix", value: `${baseRef}%` }, // Match only today's orders for this EMPID
    ]);

    const lastRefNum = result.length ? result[0].refNum : null;
    const newSequence = getNextSequence(lastRefNum, baseRef);

    // First order of the day = YYMMDD+EMPID, subsequent orders = YYMMDD+EMPID+Sequence
    return lastRefNum ? `${baseRef}${newSequence}` : baseRef;
  } catch (error) {
    console.error("Error generating refNum:", error);
    throw error;
  }
};




// ✅ Checkout Selected Items
export const checkoutCart = async (empId, selectedItems) => {
  try {
    if (!empId || !selectedItems || selectedItems.length === 0) {
      throw new Error("Invalid checkout request.");
    }

    const refNum = await generateRefNum(empId);
    const date = moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss");
    const totalItems = selectedItems.length;
    const status = "Pending";

    // Insert everything into the single 'orders' table
    // (Include total_items for the entire order)
    const insertQueries = selectedItems.map((item) => {
      return executeQuery(
        `INSERT INTO orders
         (date, empId, refNum, total_items, status, invt_id, descr, uom, quantity)
         VALUES (@date, @empId, @refNum, @total_items, @status, @invt_id, @descr, @uom, @quantity)`,
        [
          { name: "date", value: date },
          { name: "empId", value: empId },
          { name: "refNum", value: refNum },
          { name: "total_items", value: totalItems },
          { name: "status", value: status },
          { name: "invt_id", value: item.invt_id },
          { name: "descr", value: item.descr },
          { name: "uom", value: item.uom },
          { name: "quantity", value: item.quantity },
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

export const GetOrders = async (refNum) => {
  try {
    // Basic validation
    if (!refNum) {
      throw new Error("Reference Number Required");
    }
    
    // Add filtering by empId and sort by date descending
    const query = `
      SELECT * FROM orders 
      WHERE refNum = @refNum
      ORDER BY date DESC
    `;
    
    const result = await executeQuery(query, [
      { name: "refNum", value: refNum }
    ]);
    
    return result || [];
  } catch (err) {
    console.error("GetOrders Error:", err);
    throw new Error("Failed to fetch orders");
  }
};

export const getOrderLines = async (empId) => {
  try {
    
    const query = `
      SELECT DISTINCT date, refNum, total_items, status
      FROM orders
      WHERE empId = @empId
      ORDER BY date DESC
    `;
    return await executeQuery(query, [{ name: "empId", value: empId }]);
  } catch (error) {
    console.error("Error fetching order lines:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const query = "SELECT * FROM orders";
    const result = await executeQuery(query);

    return result || [];
  } catch (err) {
    console.error("getOrders Error:", err);
    return [];
  }
}

export const getAllOrderLines = async () => {
  try {
    const query = "SELECT DISTINCT date, refNum, total_items, status FROM orders ORDER BY date DESC";
    return await executeQuery(query);
  } catch (error) {
    console.error("Error fetching order lines:", error);
    return [];
  }
}

export const UpdateOrderStatus = async (refNum, status) => {
  try {
    const query = `
      UPDATE orders
      SET status = @status
      WHERE refNum = @refNum
    `;
    await executeQuery(query, [
      { name: "status", value: status },
      { name: "refNum", value: refNum }
    ]);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const getOrderlinebyStatus = async (status) => {
  try {
    const query = `
      SELECT DISTINCT date, refNum, total_items, status FROM orders ORDER BY date DESC WHERE status = @status`;
    return await executeQuery(query, [{ name: "status", value: status }]);
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrdersByStatus = async (statuses) => {
  try {
    const query = `
      SELECT DISTINCT date, refNum, total_items, status 
      FROM orders 
      WHERE status IN (${statuses.map((_, i) => `@status${i}`).join(", ")})
      ORDER BY date DESC
    `;
    const inputParameters = statuses.map((status, i) => ({ name: `status${i}`, value: status }));
    return await executeQuery(query, inputParameters);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw error;
  }
};

export const getOrdersByStatusAndEmpId = async (statuses, empId) => {
  try {
    const query = `
      SELECT DISTINCT date, refNum, total_items, status 
      FROM orders 
      WHERE status IN (${statuses.map((_, i) => `@status${i}`).join(", ")})
      AND empId = @empId
      ORDER BY date DESC
    `;
    const inputParameters = statuses.map((status, i) => ({ name: `status${i}`, value: status }));
    inputParameters.push({ name: "empId", value: empId });
    return await executeQuery(query, inputParameters);
  } catch (error) {
    console.error("Error fetching orders by status and empId:", error);
    throw error;
  }
};