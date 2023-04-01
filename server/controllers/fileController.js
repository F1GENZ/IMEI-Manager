import fs from "fs";
import fastCSV from "fast-csv";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

const importCSV = async (req, res) => {
  const filePath = `uploads/${req.file.filename}`;
  fs.createReadStream(filePath)
    .pipe(fastCSV.parse({ headers: true }))
    .on("error", (error) => {
      res.status(400);
      throw new Error(error);
    })
    .on("data", async (row) => {
      await Product.updateOne(
        { _id: mongoose.Types.ObjectId(row.id) },
        { $set: { timeGuarantee: row.timeGuarantee } }
      );
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

const exportAll = async (req, res) => {
  const data = await Product.find(
    {},
    "productTitle variantTitle codeIMEI timeGuarantee"
  );
  const csvStream = fastCSV.format({
    headers: [
      "id",
      "productTitle",
      "variantTitle",
      "codeIMEI",
      "timeGuarantee",
    ],
  });
  csvStream
    .pipe(res)
    .on("error", (error) => console.error(error))
    .on("end", process.exit);
  for (var key in data) {
    csvStream.write(data[key]);
  }
  csvStream.end();
};

const apiFile = {
  importCSV,
  exportAll,
};

export default apiFile;
