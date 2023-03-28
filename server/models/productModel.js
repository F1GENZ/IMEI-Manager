import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    productTitle: { type: String, text: true },
    productImage: String,
    productVendor: String,
    productHandle: String,
    variantID: Number,
    variantTitle: String,
    codeIMEI: { type: String, default: "" },
    timeGuarantee: Number,
    clientGuarantee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Product", productSchema);
