import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    productTitle: { type: String, text: true },
    productImage: String,
    productHandle: String,
    variantID: Number,
    variantTitle: String,
    codeIMEI: { type: String, default: "" },
    timeGuarantee: Number,
    userGuarantee: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
productSchema.index({ title: "text" });
export default mongoose.model("productModel", productSchema);
