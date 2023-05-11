import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import HaravanRouter from "./haravan/connect.js";
import WebhookRouter from "./routes/webhookRouter.js";
import connectDB from "./configs/db.js";
import routerNotify from "./routes/notifyRoute.js";
import routerProduct from "./routes/productRoute.js";
import routerClient from "./routes/clientRoute.js";
import routerFile from "./routes/fileRoute.js";
import errorHandler from "./middlewares/errorMiddleware.js";

import { socketActions } from "./socket.js";

const port = process.env.PORT || 8000;

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", HaravanRouter);
app.use("/", WebhookRouter);
app.use("/embed/clients", routerClient);
app.use("/embed/products", routerProduct);
app.use("/embed/file", routerFile);
app.use("/embed/notify", routerNotify);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => {
    res.send("Please set to production");
  });
}

app.use(errorHandler);
const server = app.listen(port, (req, res) => {
  console.log(`App listening on port ${port}`);
});

// Socket.io
socketActions(server);
