import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: String,
    handle: String,
    variantId: Number,
    imei: {
      type: String,
      default: "",
    },
    guarantee: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("productModel", productSchema);
