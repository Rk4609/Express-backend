import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    type: {
      type: String,
      enum: ["Food", "Electronics", "Clothes", "Beauty", "Others"],
      required: true
    },
    quantity: { type: Number, required: true },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    brand: { type: String, required: true },
    images: { type: [String], default: [] },
    isReturnable: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
