import { Schema, model } from "mongoose";

const customerSchema = new Schema({
  name: { type: String, required: true },
  industry: String,
  orders: [
    {
      description: String,
      amount: Number,
    },
  ],
});

export const Customer = model("Customer", customerSchema);
