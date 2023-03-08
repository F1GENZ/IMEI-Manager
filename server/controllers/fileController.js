import fs from "fs";
import { parse } from "fast-csv";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

const excelFile = async (req, res) => {
  const filePath = `uploads/${req.file.filename}`;
  fs.createReadStream(filePath)
    .pipe(parse({ headers: true }))
    .on("error", (error) => {
      res.status(400);
      throw new Error(error);
    })
    .on("data", async (row) => {
      row._id = mongoose.Types.ObjectId(row._id);
      await productModel.updateOne({ _id: row._id }, { $set: row });
    })
    .on("end", (rowCount) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          res.status(400);
          throw new Error("Delete file fail");
        }
      });
    });
  res.status(200).json("Update file success");
};

const apiFile = {
  excelFile,
};

export default apiFile;
