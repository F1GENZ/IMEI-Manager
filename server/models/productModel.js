import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: { type: String, text: true },
    handle: String,
    variantId: Number,
    variantTitle: String,
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
productSchema.index({ title: "text" });
export default mongoose.model("productModel", productSchema);
