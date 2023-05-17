import Product from "../models/productModel.js";
import moment from "moment/moment.js";
import Client from "../models/clientModel.js";
import mongoose from "mongoose";
import Promise from "bluebird";

const createClient = async (data) => {
  try {
    const { name, phone, flagid } = data;

    const flagClientExists = await Client.findOne({ "data._id": flagid })
      .populate("data.products")
      .exec();

    if (!flagClientExists) throw "Missing Flag Client";

    const flagFilter = flagClientExists.data.filter(
      (element) => element._id.toString() === flagid
    )[0];

    const client = {
      name,
      phone,
      agency: false,
      data: [
        {
          order: flagFilter.order,
          variant: flagFilter.variant,
          quantity: 1,
          timeEnd: moment()
            .add(flagFilter.products.timeGuarantee, "months")
            .format("YYYY-MM-DD"),
          products: flagFilter.products._id,
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

    flagClientExists.data.pull({ _id: flagid });
    await flagClientExists.save();

    const clientReturn = await Client.findOne({ phone });

    return clientReturn;
  } catch (error) {
    return error;
  }
};

const getUser = async (data) => {
  try {
    if (!data) throw "Missing Data";
    const { phone, variant } = data;
    const response = await Client.findOne({
      $and: [{ phone }, { "data.variant": variant }],
    })
      .populate("data.products")
      .exec();
    if (!response)
      throw "Vui lòng kiểm tra lại số điện thoại, bạn chưa có thông tin bảo hành cho sản phẩm này";
    return { client: response };
  } catch (error) {
    return { error };
  }
};

const getUsers = async (data) => {
  try {
    const { key, agency, noname, limit, paginate } = data;
    let conditional = {};
    if (typeof time !== "undefined" && time.length > 0) {
      const timeStart = moment(time[0]).toDate();
      const timeEnd = moment(time[1]).startOf("day").toDate();
      conditional = {
        $and: [
          {
            timeStart: { $gte: timeStart },
            timeEnd: { $lte: timeEnd },
          },
        ],
      };
      if (key) {
        conditional.$and.push({
          $or: [{ name: { $regex: key } }, { phone: { $regex: key } }],
        });
      }
      conditional.$and.push({ agency: agency });
      if (noname === "Yes") conditional.$and.push({ name: "", phone: "" });
    } else {
      if (key) {
        conditional = {
          $or: [{ name: { $regex: key } }, { phone: { $regex: key } }],
        };
      }
      conditional.agency = agency;
      if (noname === "Yes") {
        conditional.name = "";
        conditional.phone = "";
      }
    }
    const response = await Client.find(conditional)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip((paginate - 1) * limit)
      .populate("data.products")
      .exec();
    const count = await Client.find(conditional).count();
    return { response, totalPages: count, page: paginate };
  } catch (error) {
    return error;
  }
};

const updateClient = async (data) => {
  try {
    const { id, name, phone } = data;
    const clientExists = await Client.findOne({ phone });
    if (clientExists) {
      return "Số điện thoại đã tồn tại";
    } else {
      await Client.findByIdAndUpdate(id, { name, phone });
      return "Cập nhật tài khoản thành công";
    }
  } catch (error) {
    return error;
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

const deleteClient = async (data) => {
  try {
    await Promise.map(
      data.list,
      async (item) => {
        const clientExists = await Client.findById(data._id);
        if (!clientExists) throw new Error("Client Not Found");
        clientExists.data.pull({ _id: mongoose.Types.ObjectId(item._id) });
        await clientExists.save();
      },
      { concurrency: 1 }
    );
    return "Hủy bảo hành thành công";
  } catch (error) {
    return error;
  }
};

const deleteMasterClient = async (data) => {
  try {
    await Client.findByIdAndDelete(data);
    return "Xóa khách hàng thành công";
  } catch (error) {
    return error;
  }
}

const flagClient = async (data) => {
  try {
    const flagClientExists = await Client.findOne({ "data._id": data });
    if (flagClientExists) return flagClientExists;
    else throw "Missing FlagClient";
  } catch (error) {
    return error;
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

const activeAgency = async (data) => {
  try {
    await Promise.map(
      data.list,
      async (item) => {
        let client = {
          agency: false,
          agencyName: data.name,
          data: {
            order: item.order,
            variant: item.variant,
            quantity: item.quantity,
            timeStart: moment().format("YYYY-MM-DD"),
            timeEnd: moment()
              .add(item.products.timeGuarantee, "months")
              .format("YYYY-MM-DD"),
            products: item.products,
          },
        };
        await Client.create(client);
        await Client.findByIdAndUpdate(
          { _id: data._id },
          { $pull: { data: { _id: item._id } } },
          { safe: true, multi: false }
        );
      },
      { concurrency: 1 }
    );
    return "Kích hoạt bảo hành cho đại lý thành công";
  } catch (error) {
    return error;
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
  deleteMasterClient,
  flagClient,
  activeAgency,
  // For Webhook
  updateClientWebhook,
};

export default apiClient;
