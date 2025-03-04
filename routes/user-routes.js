import "dotenv/config.js";
import express from "express";
import {
  getUsers_Cont,
  postUsers_Cont,
  deleteUser_Cont,
  updateUser_Cont,
  updateUserPatch_Cont
} from "../controllers/user-controller.js";

const router = express.Router();

router.get(`/users`, getUsers_Cont);
router.post(`/users/insert`, postUsers_Cont);
router.delete("/users/:EMPID", deleteUser_Cont);
router.put("/users/:EMPID", updateUser_Cont);
router.patch("/users/:EMPID", updateUserPatch_Cont);

export default router;
