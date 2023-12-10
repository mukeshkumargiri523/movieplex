import { instance } from "../index.js";
import crypto from "crypto";

export const checkout = async (req, res) => {
  try {
    let options = {
      amount: Number(req.body.amount * 100), // amount in the smallest currency unit
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    let expectedSignature = await crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      res.redirect(
        `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({ success: false });
    }
    console.log(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};
