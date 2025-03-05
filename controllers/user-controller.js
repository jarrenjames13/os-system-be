
import { checkEmpidExists, insertUser, VerifyLogin, verifyUser } from "../models/users-model.js";
import { executeQuery } from "../models/users-model.js";
import bcrypt from 'bcryptjs'
import { password } from "../utils/dbcreds.js";
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
export const checkEmpidAvailability = async (req, res) => {
  try {
      const { EMPID } = req.body;

      if (!EMPID) {
          return res.status(400).json({ message: "EMPID is required" });
      }

      const empidExists = await checkEmpidExists(EMPID);

      if (empidExists) {
          return res.json({ available: false, message: "EMPID already taken" });
      } else {
          return res.json({ available: true, message: "EMPID available" });
      }
  } catch (error) {
      console.error("Error checking EMPID:", error);
      res.status(500).json({ message: "Server error" });
  }
};
export const LoginUser = async (req,res) => {
  const {EMPID, PASSWORD} = req.body;
  VerifyLogin(EMPID, true,(err, results)=>{
    if (err) {
      res.status(400).send(err)
    } else {
      if (results.status) {
        return res.send ({"res":"Employee ID not found"})
      }
      const user =results.user_details;
      
      bcrypt.compare(password, user.PASSWORD,(err,hash)=>{
        if (err){
          return res.send({"err":err})
        }
        else{
          return res.send({"res": "Employee ID or Password is incorrect"})
        }
      }
    )
    }
  }
)
}