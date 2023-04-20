import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    productID: Number,
    productTitle: { type: String, text: true },
    productImage: String,
    productVendor: String,
    productType: String,
    productHandle: String,
    productVariant: {
      type: Array,
      default: [],
    },
    timeGuarantee: Number,
    clientGuarantee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        default: [],
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Product", productSchema);
