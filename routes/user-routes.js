import "dotenv/config.js";
import express from "express";
import { getInventory_Cont, getPrices_Cont } from "../controllers/mldi/inventory-controller.js";
import {
  checkEmpidAvailability,
  getCompanies_Cont,
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
router.get(`/companies`, getCompanies_Cont )
router.get(`/inventory`, getInventory_Cont )
router.get(`/uom`, getPrices_Cont )
export default router;
