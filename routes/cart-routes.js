import "dotenv/config.js";
import express from "express"
import { getInventory_Cont, getPrices_Cont } from "../controllers/mldi/inventory-controller.js";
import { addToCart,getCartItems, deleteCartItem, deleteCartAll, UpdateCart_Cont,} from "../controllers/cart-controller.js";



const router = express.Router();

router.get(`/inventory`, getInventory_Cont )
router.get(`/uom`, getPrices_Cont )
router.post("/cart", addToCart);

router.get("/cart", getCartItems);
router.delete("/cart/delete", deleteCartItem);
router.delete("/cart/delete/all", deleteCartAll)
router.patch("/cart-update",     UpdateCart_Cont)

export default router;