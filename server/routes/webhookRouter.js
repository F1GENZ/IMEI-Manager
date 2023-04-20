import expess from "express";
const router = expess.Router();

import Auth from "../models/authModel.js";
import Product from "../models/productModel.js";
import apiClient from "../controllers/clientController.js";
import apiNotify from "../controllers/notifyController.js";

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
      console.log("Create product success");
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
      console.log("Update product success");
      break;
    }
    case "products/deleted": {
      res.sendStatus(200);
      await Product.findOneAndRemove({ productID: req.body.id });
      console.log("Delete product success");
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
          await apiNotify.createNotify(
            "clientNP",
            "Bạn có 1 đơn hàng Online không có thông tin khách hàng",
            newClient
          );
        }
      }
      console.log("Auto create client success");
      break;
    }
    case "customers/update": {
      res.sendStatus(200);
      await apiClient.updateClientWebhook(req.body);
      console.log("Update Client From Webhook Success");
      break;
    }
    default:
      break;
  }
});

export default router;
