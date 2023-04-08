const express = require("express");
const axios = require("axios");
const cors = require("cors");
var ip = require("ip");
var https = require("https");

console.log(ip.address());

const app = express();

const port = 4000;
const baseUrl = "https://fapi.binance.com/";
const leverageEndPoint = "fapi/v1/leverage";
const marginEndPoint = "fapi/v1/marginType";

const allowedOrigins = [
  "http://localhost:3000", // Örnek: React uygulamanızın adresi
  "https://fapi.binance.com/fapi/v1/leverage", // Hedef API'nin adresi
];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
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

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
