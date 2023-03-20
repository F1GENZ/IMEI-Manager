import fs from "fs";
import fastCSV from "fast-csv";
import productModel from "../models/productModel.js";
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
      await productModel.updateOne(
        { _id: mongoose.Types.ObjectId(row.id) },
        { $set: { codeIMEI: row.codeIMEI, timeGuarantee: row.timeGuarantee } }
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
  const data = await productModel.find(
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

const exportNoneImei = async (req, res) => {
  try {
    const data = await productModel.find(
      { codeIMEI: "" },
      "productTitle variantTitle codeIMEI timeGuarantee"
    );
    if (!data || data.length === 0) {
      res.status(404);
      throw "Tất cả các sản phẩm đã có mã IMEI";
    }

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
  } catch (error) {
    return res.json({ message: error });
  }
};

const apiFile = {
  importCSV,
  exportAll,
  exportNoneImei,
};

export default apiFile;
