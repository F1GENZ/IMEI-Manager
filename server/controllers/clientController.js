import Product from "../models/productModel.js";
import moment from "moment/moment.js";
import Client from "../models/clientModel.js";
import mongoose from "mongoose";

const createClient = async (req, res) => {
  try {
    const id = req.query.objectid;
    const imei = req.query.imei;
    const name = req.query.name;
    const phone = req.query.phone;
    if (!id) throw "Missing Object ID";
    if (!imei) throw "Missing imei number";
    if (!name) throw "Missing name";
    if (!phone) throw "Missing user's phone number";
    const productExists = await Product.findById(id)
      .select("clientGuarantee")
      .populate("clientGuarantee")
      .exec();

    if (!productExists) {
      throw "Không tìm thấy thông tin sản phẩm";
    }

    let clientExists = productExists.clientGuarantee.filter((client) => {
      return phone === client.phone;
    });

    if (clientExists.length === 0) {
      const product = await Product.findById(id);
      const client = new Client({
        name,
        phone,
        timeEnd: moment()
          .add(product.timeGuarantee, "months")
          .format("YYYY-MM-DD"),
        products: product._id,
      });
      client.save(function (err) {
        if (err) return handleError(err);

        product.clientGuarantee.push(client);
        product.save(function (err) {
          if (err) return handleError(err);
        });
      });
    }
    res.status(200).json(productExists);
  } catch (error) {
    res.status(401).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.query.objectid;
    const phone = req.query.phone;
    if (!id) throw "Missing id number";
    if (!phone) throw "Missing user's phone number";
    const response = await Client.findOne({
      $and: [{ phone }, { products: { $in: [mongoose.Types.ObjectId(id)] } }],
    })
      .populate("products")
      .exec();
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json(error);
  }
};

const getUsers = async (req, res) => {
  const filter = req.query.filter;
  const limit = req.query.limit;
  const paginate = req.query.paginate;
  let conditional = {};
  if (typeof filter.time !== "undefined" && filter.time.length > 0) {
    const timeStart = moment(filter.time[0]).toDate();
    const timeEnd = moment(filter.time[1]).startOf("day").toDate();
    conditional = {
      $and: [
        {
          timeStart: { $gte: timeStart },
          timeEnd: { $lte: timeEnd },
        },
      ],
    };
    if (filter.key) {
      conditional.$and.push({
        $text: {
          $search: filter.key,
        },
      });
    }
  } else {
    if (filter.key) {
      conditional = {
        $text: {
          $search: filter.key,
        },
      };
    }
  }
  const response = await Client.find(conditional)
    .limit(limit)
    .skip((paginate - 1) * limit)
    .populate("products")
    .exec();
  const count = await Client.find(conditional).count();
  res.status(200).json({ response, totalPages: count, page: paginate });
};

const apiClient = {
  createClient,
  getUsers,
  getUser,
};

export default apiClient;
