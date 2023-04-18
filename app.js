const express = require("express");
const axios = require("axios");
const cors = require("cors");
var https = require("https");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

const port = 4000;
const baseUrl = "https://fapi.binance.com/";

const leverageEndPoint = "fapi/v1/leverage";
const marginEndPoint = "fapi/v1/marginType";

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

app.post("/leverage", async (req, res) => {
  try {
    const data = req.url.split("?");

    const realUrl = baseUrl + leverageEndPoint + "?" + data[1];
    const response = await axios.post(realUrl, null, {
      headers: {
        "x-mbx-apikey": req.headers["x-mbx-apikey"],
      },
      httpsAgent,
    });

    res.send(response.data);
  } catch (error) {
    res.status(500).send(JSON.stringify(error.response.data));
  }
});

app.post("/margin", async (req, res) => {
  try {
    const data = req.url.split("?");

    const realUrl = baseUrl + marginEndPoint + "?" + data[1];
    const response = await axios.post(realUrl, null, {
      headers: {
        "x-mbx-apikey": req.headers["x-mbx-apikey"],
      },
      httpsAgent,
    });

    res.send(response.data);
  } catch (error) {
    res.status(500).send(JSON.stringify(error.response.data));
  }
});

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

app.post("/order", async (req, res) => {
  const base = "https://api.btcturk.com";
  const method = "/api/v1/order";
  const uri = base + method;

  const options = {
    headers: authentication(),
    "X-Client-IP": req.ip,
  };

  const data = {
    quantity: req.body.quantity,
    price: req.body.price,
    newOrderClientId: req.body.newOrderClientId,
    orderMethod: "limit",
    orderType: req.body.orderType,
    pairSymbol: "BTCTRY",
  };

  axios
    .post(uri, data, options)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res
        .status(error.response.status)
        .send(JSON.stringify(error.response.data));
    });

  function authentication() {
    const stamp = new Date().getTime();
    const data = Buffer.from(`${API_KEY}${stamp}`, "utf8");
    const buffer = crypto.createHmac(
      "sha256",
      Buffer.from(API_SECRET, "base64")
    );
    buffer.update(data);
    const digest = buffer.digest();
    const signature = Buffer.from(digest.toString("base64"), "utf8").toString(
      "utf8"
    );

    return {
      "Content-type": "application/json",
      "X-PCK": API_KEY,
      "X-Stamp": stamp.toString(),
      "X-Signature": signature,
    };
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
