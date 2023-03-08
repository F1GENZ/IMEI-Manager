import axios from "axios";
import productModel from "../models/productModel.js";

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

const apiProduct = {
  getProducts,
};

export default apiProduct;
