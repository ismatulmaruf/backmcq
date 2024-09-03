import { Router } from "express";
const router = Router();
import {
  payment_create,
  call_back,
  refund,
} from "../controllers/paymentController.js";
import bkashAuth from "../middleware/payment.middleware.js";

router.post("/bkash/payment/create", bkashAuth, payment_create);

router.get("/bkash/payment/callback", bkashAuth, call_back);

// router.get("/bkash/payment/callback", bkashAuth, paymentController.call_back);

router.get("/bkash/payment/refund/:trxID", bkashAuth, refund);

// module.exports = router;

export default router;
