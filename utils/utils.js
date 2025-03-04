import sql from "mssql";
import { password, server, user, database } from "./dbcreds.js";

const dbConfig = {
  user,
  password,
  server,
  database,
  requestTimeout: 30000, 
  options: {
    encrypt: false, 
    trustServerCertificate: true, 
  },
};

export const poolPromise = (async () => {
  try {
    const pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log(`✅ Connected to database: ${database} at server: ${server}`);
    return pool;
  } catch (err) {
    console.error("❌ Database connection error:", err);
    throw err; 
  }
})();

export const executeQuery = async (query, inputParameters = []) => {
  const pool = await poolPromise;
  const request = pool.request();

  inputParameters.forEach((param) => {
    request.input(param.name, param.value);
  });

  try {
    const result = await request.query(query);


    return {
      recordset: result.recordset || [],
      rowsAffected: result.rowsAffected ? result.rowsAffected[0] : 0, // ✅ Ensures rowsAffected is always a number
    };
  } catch (err) {
    console.error("executeQuery Error:", err);
    throw err;
  }
};

export const deleteUser = async (EMPID) => {
  try {
    const query = "DELETE FROM users WHERE EMPID = @EMPID";
    const inputParameters = [{ name: "EMPID", value: EMPID }];

    const result = await executeQuery(query, inputParameters);

    if (result.rowsAffected === 0) {
      return { message: "User not found or already deleted" };
    }

    return { message: "User deleted successfully" };
  } catch (err) {
    console.error("deleteUser Error:", err);
    throw err;
  }
};

export const updateUser = async (EMPID, updates) => {
  try {
    let query = "UPDATE users SET ";
    const inputParameters = [];

    // Dynamically generate update fields
    Object.keys(updates).forEach((key, index) => {
      query += `${key} = @${key}`;
      if (index < Object.keys(updates).length - 1) query += ", ";
      inputParameters.push({ name: key, value: updates[key] });
    });

    query += " WHERE EMPID = @EMPID";
    inputParameters.push({ name: "EMPID", value: EMPID });

    const result = await executeQuery(query, inputParameters);

    if (result.rowsAffected === 0) {
      return { message: "User not found or no changes made" };
    }

    return { message: "User updated successfully" };
  } catch (err) {
    console.error("updateUser Error:", err);
    throw err;
  }
};