import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import HaravanRouter from "./haravan/connect.js";
import connectDB from "./configs/db.js";
import router from "./routes/productRoute.js";
import errorHandler from "./middlewares/errorMiddleware.js";

const port = process.env.PORT || 8000;

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", HaravanRouter);
app.use("/embed/products", router);

app.use(errorHandler);
app.listen(port, (req, res) => {
  console.log(`App listening on port ${port}`);
});
