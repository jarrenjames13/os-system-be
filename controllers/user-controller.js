import {
  checkEmpidExists,
  insertUser,
  verifyLogin,
} from "../models/users-model.js";
import { executeQuery } from "../models/users-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const secret = process.env.SECRET;

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
    const { EMPID, FNAME, LNAME, EMAIL, PASSWORD, DEPARTMENT } = req.body;

    if (!PASSWORD) {
      return res.status(400).json({ error: "Password is required" });
    }

    const data = { EMPID, FNAME, LNAME, EMAIL, PASSWORD, DEPARTMENT };

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

export const loginUser_cont = async (req, res) => {
  try {
    const { EMPID, PASSWORD } = req.body;

    // Verify user existence
    const user = await verifyLogin(EMPID);

    if (!user) {
      return res.status().json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const matchPassword = await bcrypt.compare(PASSWORD, user.PASSWORD);
    if (!matchPassword) {
      return res.status(200).json({
        success: false,
        message: "Invalid password",
      });
    }
    // Successful login
    const expiresIn = "5d";
    const maxAge = 432000;
    const token = jwt.sign(
      {
        auth: user.AUTHORITY,
        EMPID: user.EMPID,
        name: user.FNAME,
        maxAge: maxAge,
      },
      secret,
      { algorithm: "HS256", expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: "Login verified",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const refreshToken = async (req, res) => {
  const { token } = req.body;

  const decoded = jwtDecode(token);
  const user = await verifyLogin(decoded.EMPID);
  try {
    const expiresIn = "5d";
    const maxAge = 432000;
    const token = jwt.sign(
      {
        auth: user.AUTHORITY,
        EMPID: user.EMPID,
        name: user.FNAME,
        maxAge: maxAge,
      },
      secret,
      { algorithm: "HS256", expiresIn }
    );
    res.send({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Internal Server Error" });
  }
};
