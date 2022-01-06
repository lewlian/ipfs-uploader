const { default: axios } = require("axios");
const express = require("express");
const cron = require("node-cron");
const fs = require("fs");
const FormData = require("form-data");
const app = express();
// const { PINATA_API_KEY, PINATA_SECRET_API_KEY } = require("./config.js");
// const { mint } = require("./wallet.js");

const port = 3000;
const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
var latestHash;

//====== CRONJOB ======//
cron.schedule("*/20 * * * * *", async () => {
  console.log(`${new Date()}: Fetching latest blockhash from blockchain...`);
  // fetch latest block hash from tzkt
  latestHash = await fetchLatestHash();

  //TODO: replace with code to send to open port in Art App
  console.log(`Latest Hash: ${latestHash}`);
});

//====== FUNCTIONS ======//
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
      console.log(e);
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

//====== ENDPOINTS ======//
app.get("/", (req, res) => {
  res.send("ipfs uploader");
});

// Connection test with Pinata
app.get("/test", (req, res) => {
  const authenticateUrl = `https://api.pinata.cloud/data/testAuthentication`;
  console.log(pinataApiKey);
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

app.get("/upload", async (req, res) => {
  //TODO Step 1: Trigger art generation on George's Art app (do we need to pass latestblockhash?)
  // - wait for fileName to come back
  fileName = "danny"; // example

  // Step 2: Form full filepath for image saved from art script
  filePath = `./images/${fileName}.jpg`;

  // Step 3: Check if the image file exist in the directory
  if (fs.existsSync(filePath)) {
    let data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    // Step 4: Pin Image to IPFS through Pinata
    ipfsCID = await uploadImage(data, fileName);

    // Step 5: Format results and send back to webapp
    finalResult = JSON.stringify({ ipfsHash: ipfsCID });
    res.status(200).send(finalResult);
  } else {
    res.status(500).send("Image file not found in directory, make sure it is saved correctly");
  }
});

app.listen(port, () => {
  console.log(`ipfs-uploader listening at http://localhost:${port}`);
});
