import { executeQuery } from "../utils/utils.js";
import { getCurrentTimeUTC8 } from "../utils/timezone.js";
import { hashPassword } from "../utils/hash.js"; 
import { deleteUser } from "../utils/utils.js";
import { updateUser } from "../utils/utils.js";

export const getUsers_Cont = async (req, res) => {
  try {
    const users = await executeQuery("SELECT * FROM users");
    res.status(200).json(users);
  } catch (err) {
    console.error("getUsers_Cont Error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const postUsers_Cont = async (req, res) => {
  try {
    const { EMPID, FNAME, LNAME, EMAIL, PASSWORD, STATUS, AUTHORITY, DEPARTMENT } = req.body;

    const hashedPassword = await hashPassword(PASSWORD);
    const DATE_CREATED = getCurrentTimeUTC8();

    const query = `
      INSERT INTO users (EMPID, FNAME, LNAME, EMAIL, PASSWORD, DATE_CREATED, STATUS, AUTHORITY, DEPARTMENT) 
      VALUES (@EMPID, @FNAME, @LNAME, @EMAIL, @PASSWORD, @DATE_CREATED, @STATUS, @AUTHORITY, @DEPARTMENT)
    `;

    const inputParameters = [
      { name: "EMPID", value: EMPID },
      { name: "FNAME", value: FNAME },
      { name: "LNAME", value: LNAME },
      { name: "EMAIL", value: EMAIL },
      { name: "PASSWORD", value: hashedPassword }, 
      { name: "DATE_CREATED", value: DATE_CREATED },
      { name: "STATUS", value: STATUS },
      { name: "AUTHORITY", value: AUTHORITY },
      { name: "DEPARTMENT", value: DEPARTMENT }
    ];

    await executeQuery(query, inputParameters);
    res.status(201).json({ message: "User inserted successfully" });
  } catch (err) {
    console.error("postUsers_Cont Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser_Cont = async (req, res) => {
  try {
    const { EMPID } = req.params;

    if (!EMPID) {
      return res.status(400).json({ error: "EMPID is required" });
    }

    const response = await deleteUser(EMPID);
    res.status(200).json(response);
  } catch (err) {
    console.error("deleteUser_Cont Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserPatch_Cont = async (req, res) => {
  try {
    const { EMPID } = req.params;
    const updates = req.body;

    if (!EMPID) {
      return res.status(400).json({ error: "EMPID is required" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    const response = await updateUser(EMPID, updates); // ✅ Uses same update function
    res.status(200).json(response);
  } catch (err) {
    console.error("updateUserPatch_Cont Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser_Cont = async (req, res) => {
  try {
    const { EMPID } = req.params;
    const updates = req.body;

    if (!EMPID) {
      return res.status(400).json({ error: "EMPID is required" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    const response = await updateUser(EMPID, updates);
    res.status(200).json(response);
  } catch (err) {
    console.error("updateUser_Cont Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
