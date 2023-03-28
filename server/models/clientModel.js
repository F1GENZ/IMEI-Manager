import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      text: true,
      require: [true, "Please add Name"],
    },
    phone: {
      type: String,
      text: true,
      require: [true, "Please add Phone Number"],
    },
    timeStart: {
      type: Date,
      default: Date.now,
      require: [true, "Please add time Start"],
    },
    timeEnd: {
      type: Date,
      require: [true, "Please add time End"],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
