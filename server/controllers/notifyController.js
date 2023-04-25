import Notify from "../models/notifyModel.js";
import Client from "../models/clientModel.js";
import { getIO } from "../socket.js";

const getNotify = async () => {
  try {
    const response = await Notify.find().sort({ createdAt: -1 });
    const count = await Notify.find().count();
    return { data: response, total: count };
  } catch (error) {
    return error;
  }
};

const deleteNotify = async (data) => {
  try {
    if (!data) throw "Missing ID";
    await Notify.findByIdAndDelete(data);
    return "Xóa thông báo thành công";
  } catch (error) {
    return error;
  }
};

const createNotify = async (data) => {
  try {
    const { type, name, phone, order, product, variant } = data;
    if (!type) throw "Missing Type";
    if (!name) throw "Missing Name";
    if (!phone) throw "Missing Phone";
    if (!order) throw "Missing Order";
    if (!phone) throw "Missing Phone";
    const notifyExists = await Notify.findOne({ target: order });
    if (notifyExists) {
      throw "Yêu cầu đang được xử lý";
    } else {
      await Notify.create({
        type,
        message: `Bạn có một yêu cầu bảo hành từ khách hàng ${name} có số điện thoại là ${phone} cho đơn hàng ${order}`,
        target: order,
      });
      const clientExists = await Client.findOne({
        phone,
      }).select({ data: { $elemMatch: { variant: variant } } });
      clientExists.data[0].countGuarantee =
        clientExists.data[0].countGuarantee + 1;
      await clientExists.save();
      getIO().emit("done-create-notify", "Bạn vừa có 1 thông báo mới");
      return "Yêu cầu đã được gửi thành công";
    }
  } catch (error) {
    return error;
  }
};

const apiNotify = {
  getNotify,
  createNotify,
  deleteNotify,
};

export default apiNotify;
