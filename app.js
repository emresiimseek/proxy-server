const express = require("express");
const axios = require("axios");
const cors = require("cors");
var ip = require("ip");
var https = require("https");
const os = require("os");

const app = express();

const port = 4000;
const baseUrl = "https://fapi.binance.com/";
const btcUrl = "https://api.btcturk.com/api/v2/ticker";

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

app.post("/order", async (req, res) => {
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(`Client IP address: ${clientIP}`);

  try {
    const realUrl = "https://api.btcturk.com/api/v1/order";
    const response = await axios.post(realUrl, req.body, {
      headers: {
        "Content-type": req.headers["Content-type"],
        "X-PCK": req.headers["X-PCK"],
        "X-Stamp": req.headers["X-Stamp"],
        "X-Signature": req.headers["X-Signature"],
      },
    });

    res.send(response.data);
  } catch (error) {
    // console.log(error);
    res.status(error.response.status).send(JSON.stringify(error.response.data));
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
