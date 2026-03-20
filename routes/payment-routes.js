import express from "express";
import { protect } from "../middlewares/auth-middleware.js";
import { createPayment } from "../controllers/payment-controller.js";
import Payment from "../models/paymend-model.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment", protect, createPayment);
paymentRouter.post("/payment-callback", async (req, res) => {
    try {
      const data = req.body;
  
      // 1️⃣ Verify hash and transaction
      const valid = verifyJazzCashHash(data);
      if (!valid) return res.status(400).send("Invalid request");
  
      // 2️⃣ Update payment record
      const payment = await Payment.findById(data.transactionId);
      payment.status = data.status === "SUCCESS" ? "success" : "failed";
      payment.transactionId = data.jazzCashTxnId;
      await payment.save();
  
      // 3️⃣ Respond to JazzCash server
      res.send("OK");
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  

export default paymentRouter;