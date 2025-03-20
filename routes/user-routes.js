import "dotenv/config.js";
import express from "express";
import {
  checkEmpidAvailability,
  getCompanies_Cont,
  getUsers_Cont,
  loginUser_cont,
  postUsers_Cont,
  refreshToken,
  UpdatePassword_Cont,
  
} from "../controllers/user-controller.js";


const router = express.Router();

router.get(`/users`, getUsers_Cont);
router.post(`/users/insert`, postUsers_Cont);
router.post("/check-empid", checkEmpidAvailability);
router.post("/login", loginUser_cont);
router.post(`/refresh`, refreshToken);
router.get(`/companies`, getCompanies_Cont )
router.post(`/changepass`, UpdatePassword_Cont)
export default router;
