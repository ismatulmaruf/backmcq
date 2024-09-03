import axios from "axios";
import Payment from "../models/paymentModel.js";
import User from "../models/user.model.js";
import globals from "node-global-storage";
import { v4 as uuidv4 } from "uuid";

const bkash_headers = async () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    authorization: globals.getValue("id_token"),
    "x-app-key": process.env.bkash_api_key,
  };
};

const payment_create = async (req, res) => {
  const { amount, userId, catid } = req.body;

  //   console.log("123", userId, catid);

  globals.setValue("userId", userId);
  globals.setValue("catid", catid);

  try {
    const { data } = await axios.post(
      process.env.bkash_create_payment_url,
      {
        mode: "0011",
        payerReference: " ",
        callbackURL: `${process.env.BACKEND_URL}/api/v1/bkash/payment/callback`,
        amount: amount,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
      },
      {
        headers: await bkash_headers(),
      }
    );
    return res.status(200).json({ bkashURL: data.bkashURL });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const call_back = async (req, res) => {
  const { paymentID, status } = req.query;

  if (status === "cancel" || status === "failure") {
    return res.redirect(`${process.env.CLIENT_URL}/error?message=${status}`);
  }
  if (status === "success") {
    try {
      const { data } = await axios.post(
        process.env.bkash_execute_payment_url,
        { paymentID },
        {
          headers: await bkash_headers(),
        }
      );
      if (data && data.statusCode === "0000") {
        const userId = globals.getValue("userId");
        const catid = globals.getValue("catid");

        await Payment.create({
          userId,
          categoryID: catid,
          paymentID,
          trxID: data.trxID,
          date: data.paymentExecuteTime,
          amount: parseInt(data.amount),
        });

        await User.findByIdAndUpdate(
          userId,
          {
            $addToSet: { subscribe: catid }, // Add catid to subscribe array if it's not already present
          },
          { new: true } // Return the updated document
        );

        return res.redirect(`${process.env.CLIENT_URL}/success`);
      } else {
        return res.redirect(
          `${process.env.CLIENT_URL}/error?message=${data.statusMessage}`
        );
      }
    } catch (error) {
      console.error(error);
      return res.redirect(
        `${process.env.CLIENT_URL}/error?message=${error.message}`
      );
    }
  }
};

const refund = async (req, res) => {
  const { trxID } = req.params;

  try {
    const payment = await Payment.findOne({ trxID });

    const { data } = await axios.post(
      process.env.bkash_refund_transaction_url,
      {
        paymentID: payment.paymentID,
        amount: payment.amount,
        trxID,
        sku: "payment",
        reason: "cashback",
      },
      {
        headers: await bkash_headers(),
      }
    );
    if (data && data.statusCode === "0000") {
      return res.status(200).json({ message: "refund success" });
    } else {
      return res.status(404).json({ error: "refund failed" });
    }
  } catch (error) {
    return res.status(404).json({ error: "refund failed" });
  }
};

export { payment_create, call_back, refund };
