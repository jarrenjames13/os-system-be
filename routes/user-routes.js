import "dotenv/config.js";
import express from "express";
import {
  checkEmpidAvailability,
  getUsers_Cont,
  loginUser_cont,
  postUsers_Cont,
  refreshToken,
} from "../controllers/user-controller.js";

const router = express.Router();

router.get(`/users`, getUsers_Cont);
router.post(`/users/insert`, postUsers_Cont);
router.post("/check-empid", checkEmpidAvailability);
router.post("/login", loginUser_cont);
router.post(`/refresh`, refreshToken);

export default router;
