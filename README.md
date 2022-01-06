# ipfs-uploader

1. Create a .env file with pinata api key and pinata secret api key (do not share)

2. ``` npm install ```

3. ```node app.js```

Note: images for now should be stored and access in `./images/` folder, can be redirected subsequently. You should have 2 samples inside already to test with.

Using Postman, you can do a GET on localhost:3000/test first to check if connection with pinata is okay

Subsequently the endpoint localhost:3000/upload/:fileName can be used to upload files to IPFS through Pinata. You should receive back a json response with the IPFSHash indicated 

Still working on retrieving the CID before uploading...
