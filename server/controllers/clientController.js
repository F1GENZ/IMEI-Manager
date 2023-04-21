import Product from "../models/productModel.js";
import moment from "moment/moment.js";
import Client from "../models/clientModel.js";
import mongoose from "mongoose";
import Promise from "bluebird";

const createClient = async (req, res) => {
  try {
    const { flagid, orderid, proid, varid, name, phone } = req.query;
    if (!flagid) throw "Missing FlagID";
    if (!orderid) throw "Missing OrderID";
    if (!proid) throw "Missing proID";
    if (!varid) throw "Missing varID";
    if (!name) throw "Missing name";
    if (!phone) throw "Missing phone";

    const flagClientExists = await Client.findOneAndUpdate(
      { "data._id": flagid },
      { $pull: { data: { _id: flagid } } },
      { safe: true, multi: false }
    );
    if (!flagClientExists) throw "FlagClient Not Found";
    flagClientExists.data.pull({ _id: flagid });
    await flagClientExists.save();

    const productExists = await Product.findOne({
      productID: proid,
    });
    if (!productExists) throw "Không tìm thấy thông tin sản phẩm";

    let client = {
      name,
      phone,
      agency: false,
      data: [
        {
          order: orderid,
          variant: varid,
          quantity: 1,
          timeEnd: moment()
            .add(productExists.timeGuarantee, "months")
            .format("YYYY-MM-DD"),
          products: productExists._id,
        },
      ],
    };

    const clientExists = await Client.findOne({ phone });
    if (!clientExists) {
      await Client.create(client);
    } else {
      client.data.forEach((item) => {
        clientExists.data.push(item);
      });
      await clientExists.save();
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(401).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const proID = req.query.proid;
    const varID = req.query.varid;
    const phone = req.query.phone;
    if (!proID) throw "Missing Product ID";
    if (!varID) throw "Missing Variant ID";
    if (!phone) throw "Missing Phone Number";
    const response = await Client.findOne({
      $and: [{ phone }, { "data.variant": varID }],
    })
      .populate("data.products")
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
    if (isNaN(filter.key)) {
      conditional.$and.push({
        $text: {
          $search: filter.key,
        },
      });
    } else {
      conditional.$and.push({ phone: { $lte: filter.key } });
    }
    if (filter.agency) conditional.$and.push({ agency: filter.agency });
    if (filter.noname === "Yes") conditional.$and.push({ name: null, phone: null });
  } else {
    if (isNaN(filter.key)) {
      conditional = {
        $text: {
          $search: filter.key,
        },
      };
    } else {
      conditional.phone = { $regex: filter.key };
    }
    if (filter.agency) conditional.agency = filter.agency;
    if (filter.noname === "Yes") {
      conditional.name = null;
      conditional.phone = null;
    }
  }
  const response = await Client.find(conditional)
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip((paginate - 1) * limit)
    .populate("data.products")
    .exec();
  const count = await Client.find(conditional).count();
  res.status(200).json({ response, totalPages: count, page: paginate });
};

const updateClient = async (req, res) => {
  try {
    const { id, name, phone } = req.body.params;
    const clientExists = await Client.findOne({ phone });
    if (clientExists) {
      res.status(200).json("Số điện thoại đã tồn tại");
    } else {
      await Client.findByIdAndUpdate(id, { name, phone });
      res.status(200).json("Cập nhật tài khoản thành công");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const autoCreateAgency = async (data) => {
  try {
    if (!data) throw "Missing Data";

    const newData = [];
    await Promise.map(
      data.line_items,
      async (item) => {
        const productExists = await Product.findOne({
          productID: item.product_id,
        });
        if (!productExists) throw "Không tìm thấy thông tin sản phẩm";
        for (let i = 0; i < Number(item.quantity); i++) {
          newData.push({
            order: data.id,
            variant: item.variant_id,
            products: productExists._id,
          });
        }
      },
      { concurrency: 1 }
    );

    let client = {
      name: `${data.customer.last_name} ${data.customer.first_name}`,
      phone: data.customer.phone,
      agency: true,
      agencyID: data.customer.id,
      data: newData,
    };

    const clientExists = await Client.findOne({ agencyID: client.agencyID });
    if (!clientExists) {
      await Client.create(client);
    } else {
      client.data.forEach((item) => {
        clientExists.data.push(item);
      });
      await clientExists.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const autoCreateClientNP = async (data) => {
  try {
    if (!data) throw "Missing Data";
    let client = {
      name: null,
      phone: null,
      agency: false,
      data: await Promise.map(data.line_items, async (item) => {
        const productExists = await Product.findOne({
          productID: item.product_id,
        });
        if (!productExists) throw "Không tìm thấy thông tin sản phẩm";

        return {
          order: data.id,
          variant: item.variant_id,
          quantity: item.quantity,
          timeEnd: moment()
            .add(productExists.timeGuarantee, "months")
            .format("YYYY-MM-DD"),
          products: productExists._id,
        };
      }),
    };
    let newClient = new Client(client);
    await newClient.save();
    return newClient;
  } catch (error) {
    console.log(error);
  }
};

const autoCreateClientYP = async (data) => {
  try {
    if (!data) throw "Missing Data";
    let client = {
      name: `${data.customer.last_name} ${data.customer.first_name}`,
      phone: data.customer.phone,
      agency: false,
      data: await Promise.map(data.line_items, async (item) => {
        const productExists = await Product.findOne({
          productID: item.product_id,
        });
        if (!productExists) throw "Không tìm thấy thông tin sản phẩm";

        return {
          order: data.id,
          variant: item.variant_id,
          quantity: item.quantity,
          timeEnd: moment()
            .add(productExists.timeGuarantee, "months")
            .format("YYYY-MM-DD"),
          products: productExists._id,
        };
      }),
    };

    const clientExists = await Client.findOne({ phone: data.customer.phone });
    if (!clientExists) {
      await Client.create(client);
    } else {
      client.data.forEach((item) => {
        clientExists.data.push(item);
      });
      await clientExists.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteClient = async (req, res) => {
  try {
    const parent = req.body.params.parent;
    const child = req.body.params.child;
    if (!parent) throw new Error("Missing Parent ID");
    if (!child) throw new Error("Missing Child ID");
    const clientExists = await Client.findById(parent);
    if (!clientExists) throw new Error("Client Not Found");
    clientExists.data.pull({ _id: mongoose.Types.ObjectId(child) });
    await clientExists.save();
    res.status(200).json("Delete Success");
  } catch (error) {
    res.status(400).json(error);
  }
};

const flagClient = async (req, res) => {
  try {
    const id = req.params.id;
    const flagClientExists = await Client.findOne({ "data._id": id });
    if (flagClientExists) {
      res.status(200).json(flagClientExists);
    } else {
      throw "Missing FlagClient";
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateClientWebhook = async (data) => {
  try {
    const { first_name, last_name, id, phone } = data;
    await Client.findOneAndUpdate(
      { agencyID: id },
      {
        name: `${last_name} ${first_name}`,
        phone,
      },
      { safe: true, multi: false }
    );
  } catch (error) {
    console.log(error);
  }
};

const activeAllAgencty = async (req, res) => {
  try {
    const data = req.body.params;
console.log(data);
    let client = {
      name: null,
      phone: null,
      agency: false,
      data: await Promise.map(data.list, async (item) => {
        return {
          order: item.order,
          variant: item.variant,
          quantity: item.quantity,
          timeStart: moment().format("YYYY-MM-DD"),
          timeEnd: moment()
            .add(item.products.timeGuarantee, "months")
            .format("YYYY-MM-DD"),
          products: item.products,
        };
      }),
    };
    let newClient = new Client(client);
    await newClient.save();

    await Client.findByIdAndDelete(data._id);

    res.status(200).json("Kích hoạt bảo hành cho đại lý thành công");
  } catch (error) {
    res.status(400).json(error);
  }
};

const apiClient = {
  createClient,
  getUsers,
  getUser,
  autoCreateAgency,
  autoCreateClientYP,
  autoCreateClientNP,
  updateClient,
  deleteClient,
  flagClient,
  activeAllAgencty,
  // For Webhook
  updateClientWebhook,
};

export default apiClient;
