import { hashPassword } from "../utils/hash.js";
import { poolPromise } from "../utils/utils.js";
import { getCurrentTimeUTC8 } from "../utils/timezone.js";

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

export const insertUser = async (data, callback) => {
  try {
    const hashedPassword = await hashPassword(data.PASSWORD);
    const DATE_CREATED = getCurrentTimeUTC8();

    const query = `
        INSERT INTO users (EMPID, FNAME, LNAME, EMAIL, PASSWORD, DATE_CREATED, STATUS, AUTHORITY, DEPARTMENT) 
        VALUES (@EMPID, @FNAME, @LNAME, @EMAIL, @PASSWORD, @DATE_CREATED, @STATUS, @AUTHORITY, @DEPARTMENT)
      `;

    const inputParameters = [
      { name: "EMPID", value: data.EMPID },
      { name: "FNAME", value: data.FNAME },
      { name: "LNAME", value: data.LNAME },
      { name: "EMAIL", value: data.EMAIL },
      { name: "PASSWORD", value: hashedPassword },
      { name: "DATE_CREATED", value: DATE_CREATED },
      { name: "STATUS", value: "ACTIVE" },
      { name: "AUTHORITY", value: 3 },
      { name: "DEPARTMENT", value: data.DEPARTMENT },
    ];

    await executeQuery(query, inputParameters);

    callback(null, { message: "User inserted successfully", status: true });
  } catch (error) {
    console.error("insertUser Error:", error);

    callback(error, { message: "FAILED", status: false });
  }
};

export const checkEmpidExists = async (EMPID) => {
  const query = "SELECT EMPID FROM users WHERE EMPID = @EMPID";
  const result = await executeQuery(query, [{ name: "EMPID", value: EMPID }]);
  return result.length > 0; // Returns true if EMPID exists
};

export const verifyLogin = async (EMPID) => {
  try {
    const inputParameters = [{ name: "EMPID", value: EMPID }];
    const loginQuery = "SELECT * FROM USERS WHERE EMPID = @EMPID";

    const result = await executeQuery(loginQuery, inputParameters);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Database query failed:", error);
    return null; // Ensure the function always returns something
  }
};