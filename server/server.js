import dotenv from "dotenv";
dotenv.config();

import express from "express";
import HaravanRouter from "./haravan/connect.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 8000;

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", HaravanRouter);

app.listen(port, (req, res) => {
  console.log(`App listening on port ${port}`);
});