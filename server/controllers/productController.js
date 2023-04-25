import Product from "../models/productModel.js";
import Client from "../models/clientModel.js";
import mongoose from "mongoose";

const getProducts = async (data) => {
  try {
    if (!data) throw "Missing Data: Get Products";
    const { key, limit, paginate } = data;
    const response = await Product.find({ productTitle: { $regex: key } })
      .limit(limit)
      .skip((paginate - 1) * limit);
    const count = await Product.find({ productTitle: { $regex: key } }).count();
    return { response, totalPages: count, page: paginate };
  } catch (error) {
    return error;
  }
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  const response = await Product.findOne({ _id: id })
    .populate("clientGuarantee")
    .exec();
  res.status(200).json({ response });
};

const updateProduct = async (data) => {
  try {
    const { id, timeGuarantee } = data;
    await Product.findOneAndUpdate(
      { _id: id },
      { timeGuarantee },
      { safe: true, multi: false }
    );
    return "Cập nhật sản phẩm thành công";
  } catch (error) {
    return "Cập nhật sản phẩm thất bại";
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const clientID = req.query.clientid;
  if (!id) throw "Missing imei's ID";
  if (!clientID) throw "Missing user's ID";
  const response = await Product.findById(id)
    .populate("clientGuarantee")
    .exec();
  if (response) {
    response.clientGuarantee.pull({ _id: mongoose.Types.ObjectId(clientID) });
    response.save(async function (err) {
      if (err) return handleError(err);

      await Client.findByIdAndRemove(clientID);
    });
  }
  res.status(200).json({ response });
};

const apiProduct = {
  getProducts,
  getProduct,
  updateProduct,
  deleteUser,
};

export default apiProduct;
