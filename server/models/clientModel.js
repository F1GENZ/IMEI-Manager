import mongoose from "mongoose";
import productModel from "./productModel";

const clientSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      require: [true, "Please add Phone Number"],
    },
    data: productModel,
  },
  { timestamps: true }
);

export default mongoose.model("clientModel", clientSchema);
