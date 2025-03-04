import "dotenv/config.js";
import express from "express";
import {
  getUsers_Cont,
  postUsers_Cont,
} from "../controllers/user-controller.js";

const router = express.Router();

router.get(`/users`, getUsers_Cont);
router.post(`/users/insert`, postUsers_Cont);

export default router;
