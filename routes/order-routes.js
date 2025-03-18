import express from "express";
import { HandleCheckout} from "../controllers/order-controller";




const router = express.Router();

router.post("/checkout", HandleCheckout)

export default router;