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
    agency: {
      type: Boolean,
      default: false,
    },
    agencyID: {
      type: String,
      default: false,
    },
    countGuarantee: {
      type: Number,
      default: 0
    },
    data: [
      {
        order: {
          type: String,
          text: true,
          require: [true, "Please add OrderID"],
        },
        variant: {
          type: String,
          text: true,
          require: [true, "Please add VariantID"],
        },
        quantity: {
          type: Number,
          text: true,
          require: [true, "Please add Quantity"],
          default: 1,
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
        products: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  { timestamps: true }
);
clientSchema.index({ name: "text" }, { phone: "text " });
export default mongoose.model("Client", clientSchema);
