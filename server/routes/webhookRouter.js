import expess from "express";
const router = expess.Router();

import Auth from "../models/authModel.js";
import Product from "../models/productModel.js";
import apiClient from "../controllers/clientController.js";
import apiNotify from "../controllers/notifyController.js";
import { getIO } from "../socket.js";

router.get("/embed/webhooks", (req, res) => {
  var verify_token = req.query["hub.verify_token"] || "";
  var hrvVerifyToken = "imei-manager-0932093794" || "";
  if (verify_token != hrvVerifyToken) {
    return res.sendStatus(401);
  }
  res.send(req.query["hub.challenge"]);
});

router.post("/embed/webhooks", async (req, res) => {
  let topic = req.headers["x-haravan-topic"] || "";
  let org_id = req.headers["x-haravan-org-id"] || "";
  switch (topic) {
    case "app/uninstalled": {
      res.sendStatus(200);
      let orgid = req.body.org_id;
      await Auth.findOneAndRemove({ orgid });
      console.log("Remove store success");
      break;
    }
    case "products/create": {
      res.sendStatus(200);
      let item = {
        productID: req.body.id,
        productTitle: req.body.title,
        productImage:
          req.body.images.length > 0 ? req.body.images[0].src : null,
        productVendor: req.body.vendor,
        productType: req.body.product_type,
        productHandle: req.body.handle,
        productVariant: await req.body.variants.map((value, key) => {
          let variant = {
            variantID: value.id,
            variantTitle: value.title,
          };
          return variant;
        }),
      };

      await Product.create(item);
      getIO().emit(
        "done-create-products-wh",
        `Sản phẩm ${item.productTitle} được tạo thành công`
      );
      break;
    }
    case "products/update": {
      res.sendStatus(200);
      let item = {
        productID: req.body.id,
        productTitle: req.body.title,
        productImage:
          req.body.images.length > 0 ? req.body.images[0].src : null,
        productVendor: req.body.vendor,
        productType: req.body.product_type,
        productHandle: req.body.handle,
        productVariant: await req.body.variants.map((value, key) => {
          let variant = {
            variantID: value.id,
            variantTitle: value.title,
          };
          return variant;
        }),
      };

      await Product.findOneAndUpdate({ productID: req.body.id }, item);
      getIO().emit(
        "done-update-products-wh",
        ""
        // `Cập nhật sản phẩm ${item.productTitle} thành công`
      );
      break;
    }
    case "products/deleted": {
      res.sendStatus(200);
      await Product.findOneAndRemove({ productID: req.body.id });
      getIO().emit("done-delete-products-wh", "Xóa sản phẩm thành công");
      break;
    }
    case "orders/create": {
      res.sendStatus(200);
      const data = req.body;
      const checkOnline = data.customer.tags;
      if (checkOnline === "daily") {
        await apiClient.autoCreateAgency(data);
      } else {
        if (
          (data.customer.last_name || data.customer.first_name) &&
          data.customer.phone
        ) {
          await apiClient.autoCreateClientYP(data);
        } else {
          const newClient = await apiClient.autoCreateClientNP(data);
          if (!newClient) throw new Error("Create Client Error");
        }
      }
      getIO().emit("done-create-clients-wh", "Bạn có 1 đơn hàng mới");
      break;
    }
    case "customers/update": {
      res.sendStatus(200);
      await apiClient.updateClientWebhook(req.body);
      getIO().emit("done-update-agency-wh", "Cập nhật thành công từ Haravan");
      break;
    }
    default:
      break;
  }
});

export default router;
