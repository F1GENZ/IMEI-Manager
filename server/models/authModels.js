import mongoose from "mongoose";

const authSchema = mongoose.Schema(
  {
    access_token: {
      type: String,
      require: [true, "Missing accessToken"],
    },
    expires_in: {
      type: String,
      require: [true, "Missing expires"],
    },
    orgid: {
      type: String,
      require: [true, "Missing orgid"],
    },
  },
  { timestamp: true }
);

export default mongoose.model("authmodels", authSchema);
