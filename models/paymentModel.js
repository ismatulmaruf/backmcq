import { model, Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    userId: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    trxID: {
      type: String,
    },
    paymentID: {
      type: String,
    },
    date: {
      type: String,
    },
    categoryId: {
      type: String,
    },
    userId: { type: Schema.Types.ObjectId, required: true },
    categoryID: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const Payment = model("Payment", PaymentSchema);

export default Payment;
