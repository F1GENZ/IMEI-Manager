import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2 } from "oauth";
import Auth from "../models/authModel.js";
import axios from "axios";
import Product from "../models/productModel.js";
import Promise from "bluebird";

const router = express.Router();

const config = {
  response_mode: "form_post",
  url_authorize: "https://accounts.haravan.com/connect/authorize",
  url_connect_token: "https://accounts.haravan.com/connect/token",
  grant_type: "authorization_code",
  nonce: "imei_manager",
  response_type: "code id_token",
  app_id: "366c210563f642fb51603d9b56cd01b5",
  app_secret:
    "44a3aa3fdbc9c665e6ce54982a234d92af983ae4ceada403e1279c3ed19cdc8b",
  scope_login: "openid profile email org userinfo",
  scope:
    "openid profile email org userinfo com.write_orders com.read_orders com.write_products com.read_products grant_service wh_api",
  login_callback_url: `https://imei-manager-zqz6j.ondigitalocean.app/install/login`,
  install_callback_url: `https://imei-manager-zqz6j.ondigitalocean.app/install/grandservice`,
  orgid: "200000632501",
  webhook: {
    subscribe: "https://webhook.haravan.com/api/subscribe",
  },
};

// Product in Store
const fetchProduct = async (access_token) => {
  try {
    const response = await axios.get(
      "https://apis.haravan.com/com/products.json?fields=id,title,vendor,product_type,variants,handle,images",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};
const saveProduct = async (data) => {
  try {
    let item = {
      productID: data.id,
      productTitle: data.title,
      productImage: data.images.length > 0 ? data.images[0].src : null,
      productVendor: data.vendor,
      productType: data.product_type,
      productHandle: data.handle,
      productVariant: await data.variants.map((value, key) => {
        let variant = {
          variantID: value.id,
          variantTitle: value.title,
        };
        return variant;
      }),
      timeGuarantee: 12,
    };
    let productExists = await Product.findOne({ productID: data.id });
    if (productExists) {
      await Product.updateOne(item);
    } else {
      await Product.create(item);
    }
  } catch (error) {
    console.log(error.response);
  }
};

router.get("/install/login", async (req, res) => {
  const url = `https://accounts.haravan.com/connect/authorize?response_mode=${config.response_mode}&response_type=${config.response_type}&scope=${config.scope_login}&client_id=${config.app_id}&redirect_uri=${config.login_callback_url}&nonce=${config.nonce}&orgid=${config.orgid}`;
  res.redirect(url);
});

router.post("/install/login", async (req, res) => {
  const decodeToken = jwt.decode(req.body.id_token);
  if (decodeToken.role[0] == "admin") {
    const origid = config.orgid;
    const shopExists = await Auth.find({ origid });
    if (shopExists.length !== 0) {
      res.redirect(
        `https://imei-manager-zqz6j.ondigitalocean.app/authentication?access_token=${shopExists[0].access_token}`
      );
    } else {
      const url = `https://accounts.haravan.com/connect/authorize?response_mode=${config.response_mode}&response_type=${config.response_type}&scope=${config.scope}&client_id=${config.app_id}&redirect_uri=${config.install_callback_url}&nonce=${config.nonce}&orgid=${config.orgid}`;
      res.redirect(url);
    }
  } else {
    res.status(401).send("Not authorized");
  }
});

router.post("/install/grandservice", async (req, res) => {
  try {
    let code = req.body.code;
    if (!code) {
      return res.status(401).json("Code not found in request");
    }
    let token = await getToken(code, config.install_callback_url);
    if (!token) throw "Missing Token";
    let authorizeInfo = {
      access_token: token.access_token,
      expires_in: token.expires_in,
      orgid: config.orgid,
    };
    if (authorizeInfo) {
      await Auth.create(authorizeInfo);
      await subscribe_webhook(token.access_token);
      const productData = await fetchProduct(token.access_token);
      if (productData.products) {
        await Promise.map(
          productData.products,
          async (element) => {
            await saveProduct(element);
          },
          {
            concurrency: 1,
          }
        );
      }
    }
    res.redirect(
      `https://imei-manager-zqz6j.ondigitalocean.app/authentication?access_token=${authorizeInfo.access_token}`
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

function getToken(code, callback_url) {
  return new Promise((resolve) => {
    try {
      let params = {};
      params.grant_type = config.grant_type;
      params.redirect_uri = callback_url;

      let _oauth2 = new OAuth2(
        config.app_id,
        config.app_secret,
        "",
        config.url_authorize,
        config.url_connect_token,
        ""
      );

      _oauth2.getOAuthAccessToken(
        code,
        params,
        (err, accessToken, refreshToken, param_token) => {
          if (err) {
            console.log("error", err);
            resolve();
          } else {
            resolve(param_token);
          }
        }
      );
    } catch (error) {
      console.log("error", error);
      return resolve();
    }
  });
}

// Webhooks
const subscribe_webhook = async (access_token) => {
  try {
    await axios.post(config.webhook.subscribe, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log("Subscribe webhook success");
  } catch (error) {
    console.log(error.response);
  }
};

export default router;
