
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

export const postUsers_Cont = async (req, res) => {
  try {
    const { EMPID, FNAME, LNAME, EMAIL, PASSWORD, STATUS, AUTHORITY, DEPARTMENT } = req.body;

    
    const data = { EMPID, FNAME, LNAME, EMAIL, PASSWORD, STATUS, AUTHORITY, DEPARTMENT }

    await insertUser((data, result => {
      if(result.status){
        res.status(201).json(result);
        return
      }
      
      res.status(400).json(result)
    }))

    
  } catch (err) {
    console.error("postUsers_Cont Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

