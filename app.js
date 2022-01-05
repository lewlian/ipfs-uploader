const { default: axios } = require("axios");
const express = require("express");
const fs = require("fs");
const FormData = require("form-data");
const app = express();
const Hash = require("ipfs-only-hash");

require("dotenv").config();

const port = 3000;
const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

app.get("/", (req, res) => {
  res.send("hello World!");
});

app.get("/test", (req, res) => {
  const authenticateUrl = `https://api.pinata.cloud/data/testAuthentication`;
  axios
    .get(authenticateUrl, {
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then((response) => {
      console.log(response);
      res.send(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.get("/upload/:fileName", async (req, res) => {
  fileName = req.params.fileName;
  filePath = `./images/${fileName}.jpg`;

  // ========= Calculating the hash of the image file before uploading, but the CID =/= ipfs hash somehow ============
  //   fs.readFile(filePath, async (err, data) => {
  //     if (err) throw err;
  //     let str = data.toString("base64");
  //     const hash = await Hash.of(str);
  //     console.log(hash);
  //   });

  // if the image file exist in the directory
  if (fs.existsSync(filePath)) {
    let data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    axios
      .post(url, data, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send(e);
      });
  } else {
    res.status(500).send("Image file not found in directory, make sure it is saved correctly");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
