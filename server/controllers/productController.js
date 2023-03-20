import axios from "axios";
import productModel from "../models/productModel.js";
import moment from "moment/moment.js";

const getProducts = async (req, res) => {
  const filter = req.query.filter;
  let conditional = {};
  if (filter) {
    conditional = {
      $text: {
        $search: filter,
      },
    };
  }
  const response = await productModel.find(conditional);
  res.status(200).json(response);
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  const response = await productModel.findOne({ _id: id });
  res.status(200).json(response);
};

const createUser = async (req, res) => {
  try {
    const imei = req.query.imei;
    const name = req.query.name;
    const phone = req.query.phone;
    if (!imei) throw "Missing imei number";
    if (!name) throw "Missing name";
    if (!phone) throw "Missing user's phone number";
    const response = await productModel.findOne({ codeIMEI: imei });
    if (!response) {
      throw "Không tìm thấy dữ liệu sản phẩm";
    }
    const responseUser = await productModel.findOne({
      codeIMEI: imei,
      userGuarantee: { $elemMatch: { phone: { $gte: phone } } },
    });
    if (!responseUser) {
      var newUser = {
        name,
        phone,
        timeStart: moment().format("DD/MM/YYYY"),
        timeEnd: moment()
          .add(response.timeGuarantee, "months")
          .format("DD/MM/YYYY"),
      };
      response.userGuarantee.push(newUser);
      response.save();
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(401).json(error);
  }
};

const deleteUser = async (req, res) => {
  const id = req.query.id;
  const phone = req.query.phone;
  if (!id) res.status(401).json("Missing imei's id number");
  if (!phone) res.status(401).json("Missing user's phone number");
  const responseUser = await productModel.updateOne(
    { _id: id },
    { $pull: { userGuarantee: { phone: phone } } }
  );
  const response = await productModel.findOne({ _id: id });
  if (!response) {
    throw "Không tìm thấy dữ liệu sản phẩm";
  }
  res.status(200).json(response);
};

const getUser = async (req, res) => {
  const imei = req.query.imei;
  const phone = req.query.phone;
  if (!imei) res.status(401).json("Missing imei number");
  if (!phone) res.status(401).json("Missing user's phone number");
  const responseUser = await productModel.findOne({
    codeIMEI: imei,
    userGuarantee: { $elemMatch: { phone: { $gte: phone } } },
  });
  res.status(200).json(responseUser);
};

const apiProduct = {
  getProducts,
  getProduct,
  createUser,
  deleteUser,
  getUser,
};

export default apiProduct;
