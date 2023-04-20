import mongoose from "mongoose";

const notifySchema = mongoose.Schema(
  {
    type: String,
    message: String,
    target: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Notify", notifySchema);
