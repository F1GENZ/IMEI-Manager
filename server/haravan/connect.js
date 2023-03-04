import express from "express";
import jwt from "jsonwebtoken";
import request from "request";
import { OAuth2 } from "oauth";
import authModels from "../models/authModels.js";

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
  scope: "openid profile email org userinfo grant_service wh_api",
  login_callback_url: "http://localhost:5000/install/login",
  install_callback_url: "http://localhost:5000/install/grandservice",
  orgid: 1000409769,
  webhook: {
    hrvVerifyToken: "imei-manager-0932093794",
    subscribe: "https://webhook.haravan.com/api/subscribe",
  },
};

router.get("/install/login", async (req, res) => {
  const origid = config.orgid;
  const shopExists = await authModels.find({ origid });
  const url = `https://accounts.haravan.com/connect/authorize?response_mode=${config.response_mode}&response_type=${config.response_type}&scope=${config.scope_login}&client_id=${config.app_id}&redirect_uri=${config.login_callback_url}&nonce=${config.nonce}&orgid=${config.orgid}`;
  if (shopExists.length !== 0) {
    res.redirect("http://localhost:3000/manager/product");
  } else {
    res.redirect(url);
  }
});

router.post("/install/login", (req, res) => {
  let code = req.body.code;
  if (!code) {
    return res.status(401).json("Code not found");
  }
  const decodeToken = jwt.decode(req.body.id_token);
  if (decodeToken.role[0] == "admin") {
    const url = `https://accounts.haravan.com/connect/authorize?response_mode=${config.response_mode}&response_type=${config.response_type}&scope=${config.scope}&client_id=${config.app_id}&redirect_uri=${config.install_callback_url}&nonce=${config.nonce}&orgid=${config.orgid}`;
    res.redirect(url);
  } else {
    res.status(401).send("Not authorized");
  }
});

router.post("/install/grandservice", async (req, res) => {
  let code = req.body.code;
  if (!code) {
    return res.status(401).json("Code not found in request");
  }
  let token = await getToken(code, config.install_callback_url);
  if (!token) res.status(401).json("Token not Found");
  let authorizeInfo = {
    access_token: token.access_token,
    expires_in: token.expires_in,
    orgid: config.orgid,
  };
  if (authorizeInfo) {
    await authModels.create(authorizeInfo);
    await subscribe_webhook(authorizeInfo.access_token);
  }
  res.redirect("http://localhost:3000/manager/product");
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
  let options = {
    method: "POST",
    url: config.webhook.subscribe,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  request(options, (err, res, body) => {
    if (err) console.log(err);
    console.log("Subscribe webhook success");
  });
};

router.get("/embed/webhooks", (req, res) => {
  var verify_token = req.query["hub.verify_token"] || "";
  var hrvVerifyToken = config.webhook.hrvVerifyToken || "";
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
      await authModels.findOneAndRemove({ orgid });
      break;
    }
    default:
      res.sendStatus(200);
      break;
  }
});

export default router;
