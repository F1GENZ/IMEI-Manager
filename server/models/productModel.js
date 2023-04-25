import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    productID: Number,
    productTitle: String,
    productImage: String,
    productVendor: String,
    productType: String,
    productHandle: String,
    productVariant: {
      type: Array,
      default: [],
    },
    timeGuarantee: {
      type: Number,
      default: 12,
    },
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
