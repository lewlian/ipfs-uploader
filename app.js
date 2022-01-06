const { default: axios } = require("axios");
const express = require("express");
const fs = require("fs");
const FormData = require("form-data");
const app = express();
const Hash = require("ipfs-only-hash");
const {
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY
} = require('./config.js')
const { mint } = require('./wallet.js')

const port = 3000;
const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
const pinataApiKey = PINATA_API_KEY 
const pinataSecretApiKey = PINATA_SECRET_API_KEY 

app.get("/", (req, res) => {
  res.send("ipfs uploader");
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
async function uploadImage(data, fileName) {
  console.log(`Uploading ${fileName} to IPFS through Pinata...`);
  result = await axios
    .post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then((response) => {
      console.log(`Image successfully uploaded`);
      return response.data;
    })
    .catch((e) => {
      console.log(`Image upload unsuccessful`);
      return e;
    });
  return result["IpfsHash"];
}

async function fetchLatestHash() {
  result = await axios
    .get("https://api.tzkt.io/v1/blocks/?sort.desc=id&limit=1")
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return e;
    });
  return result[0]["hash"];
}

app.get("/upload/:fileName", async (req, res) => {
  // retrieve filepath for image saved from art script
  fileName = req.params.fileName;
  filePath = `./images/${fileName}.jpg`;

  // if the image file exist in the directory
  if (fs.existsSync(filePath)) {
    let data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    // pin to IPFS through Pinata
    ipfsCID = await uploadImage(data, fileName);
    // fetch latest block hash from tzkt
    latestHash = await fetchLatestHash();

    // format results (TO BE EDITED: needs to send to 2 different locations, Web App and second localhost port)
    finalResult = JSON.stringify({ ipfsHash: ipfsCID, latestBlockHash: latestHash });
    res.status(200).send(finalResult);
  } else {
    res.status(500).send("Image file not found in directory, make sure it is saved correctly");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
