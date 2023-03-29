import Auth from "../models/authModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Get User form token
      let authVerify = await Auth.find({ access_token: token });
      if (authVerify.length > 0) {
        next();
      } else {
        res.status(401);
        throw new Error("Not authorized");
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;
