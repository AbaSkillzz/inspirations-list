const express = require("express");
require("dotenv").config({path: "../.env"});
const path = require("path");

const app = express();
//serving js in /public at /static, to have access to the DOM
app.use("/static", express.static("./public"));

//ROUTES
app.get("/", (req, res) => {
   res.sendFile(path.resolve("./frontend/index.html"));
});


//start server
const port = process.env.WEBSERVER_PORT;
app.listen(port, () => {
   console.log(`Webserver running at port ${port}`);
});   