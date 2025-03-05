
import { insertUser } from "../models/users-model.js";
import { executeQuery } from "../models/users-model.js";
export const getUsers_Cont = async (req, res) => {
  try {
    const users = await executeQuery("SELECT * FROM users");
    res.status(200).json(users);
  } catch (err) {
    console.error("getUsers_Cont Error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const postUsers_Cont = (req, res) => {
  try {
    const { EMPID, FNAME, LNAME, EMAIL, PASSWORD,  DEPARTMENT } = req.body;

    if (!PASSWORD) {
      return res.status(400).json({ error: "Password is required" });
    }

    const data = { EMPID, FNAME, LNAME, EMAIL, PASSWORD,  DEPARTMENT };


    insertUser(data, (err, result) => {
      if (err || !result.status) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    });

  } catch (err) {
    console.error("postUsers_Cont Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
