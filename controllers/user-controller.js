import { getUsers } from "../models/users-model.js";

export const getUsers_Cont = async (req, res) => {
  try {
    const users_data = await getUsers()

    res.json(users_data)
  } catch (err) {
    console.log("getUsers_Cont :", err);
    return res.json({ msg: "Internal Server Error!" });
  }
};
