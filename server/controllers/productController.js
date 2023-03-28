import Product from "../models/productModel.js";
import Client from "../models/clientModel.js";
import mongoose from "mongoose";

const getProducts = async (req, res) => {
  const filter = req.query.filter;
  const limit = req.query.limit;
  const paginate = req.query.paginate;
  let conditional = {};
  if (filter) {
    conditional = {
      $text: {
        $search: filter,
      },
    };
  }
  const response = await Product.find(conditional)
    .limit(limit)
    .skip((paginate - 1) * limit);
  const count = await Product.find(conditional).count();
  res.status(200).json({ response, totalPages: count, page: paginate });
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  const response = await Product.findOne({ _id: id })
    .populate("clientGuarantee")
    .exec();
  res.status(200).json({ response });
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const timeGuarantee = req.query.timeGuarantee;
  const response = await Product.findOne({ _id: id })
    .populate("clientGuarantee")
    .exec();

  response.timeGuarantee = timeGuarantee;
  response.save();
  res.status(200).json({ response });
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
