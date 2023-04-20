import Notify from "../models/notifyModel.js";

const getNotify = async (req, res) => {
  try {
    const response = await Notify.find();
    const count = await Notify.find().count();
    res.status(200).json({ data: response, total: count });
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteNotify = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw "Missing ID";
    await Notify.findByIdAndDelete(id);
    res.status(200).json(`Delete Notify Success`);
  } catch (error) {
    res.status(200).json(error);
  }
};

const createNotifyFetch = async (req, res) => {
  try {
    const type = req.body.type;
    const message = req.body.message;
    const target = req.body.target;
    if (!type) throw "Missing Type";
    if (!message) throw "Missing Message";
    if (!target) throw "Missing Target";
    const notifyExists = await Notify.findOne({ target });
    if (notifyExists) {
      throw "Yêu cầu đang được xử lý";
    } else {
      await Notify.create({
        type,
        message,
        target,
      });
      res.status(200).json("Yêu cầu đã được gửi thành công");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const createNotify = async (type, message, data) => {
  try {
    if (!type) throw "Missing Type";
    if (!message) throw "Missing Message";
    if (!data) throw "Missing Data";
    await Notify.create({
      type,
      message,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

const apiNotify = {
  getNotify,
  createNotify,
  deleteNotify,

  createNotifyFetch,
};

export default apiNotify;
