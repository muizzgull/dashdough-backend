import Payment from "../models/paymend-model.js"


export const createPayment = async (req, res) => {
    try {
      const { amount } = req.body;
      console.log("amount ", amount);
      const user = req.user;
  
      // 1️⃣ Create a pending payment record
      const payment = await Payment.create({
        user: user._id,
        amount,
        status: "pending",
      });
  
      // 2️⃣ Prepare JazzCash request payload
      const payload = {
        // Merchant credentials
        merchantId: process.env.JAZZCASH_MERCHANT_ID,
        password: process.env.JAZZCASH_PASSWORD,
        // Transaction info
        amount: amount * 100, // sometimes amount in smallest currency unit
        transactionId: payment._id, // use DB ID as reference
        returnUrl: process.env.JAZZCASH_RETURN_URL,
        // other fields required by JazzCash
      };
  
      // 3️⃣ Generate secure hash
      payload.hash = generateJazzCashHash(payload);
  
      // 4️⃣ Send response with payload to frontend
      res.status(200).json({
        success: true,
        payment,
        payload, // frontend will submit this to JazzCash
      });
  
    } catch (error) {
      console.error("Payment Error:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };