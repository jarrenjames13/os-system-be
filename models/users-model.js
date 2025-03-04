import { poolPromise } from "../utils/utils.js";

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

export const getUsers = async () => {
  try {
    const query = "SELECT * FROM users";
    const result = await executeQuery(query); 

    return result || []; 
  } catch (err) {
    console.error("getUsers Error:", err);
    return []; 
  }
};

