const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config({path: "../.env"});
const InspirationModel = require("./models/Inspiration");
const bodyParser = require("body-parser");
const Inspiration = require("./models/Inspiration");
const path = require("path");
const cors = require("cors");
const cloudinary = require("cloudinary");
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");

const app = express();

//middleware: esegue function quando client va su un route
app.use(cors()); //to enable access to external domains clients
app.use(bodyParser.json()); //middleware che viene eseguito ad ogni request, aiuta a lavorare con json

//DB connection
mongoose.set('strictQuery', false);

const connection = process.env.DB_CONNECTION;
mongoose.connect(connection)
   .then((res) => {
      console.log("Promise resolved, connected to db!");
   })
   .catch((err) => {
      console.log("Error in db connection: ", err);
   });

//settings to receive and process images(images part)
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
   cloudinary: cloudinary,
   folder: "images",
   transformation: [{ width: 500, height: 500, crop: "limit" }]
});
//middleware to get the imageFile from frontend and send it to cloudinary
const parser = multer({storage: storage});


//routes 
app.get("/", function(req, res){
   console.log("GET request for /");
   res.send("API to retrieve your inspirations, go to /inpirations for the list");
});

app.get("/inspirations", async function(req, res){
   console.log("GET request for /inspirations");
   
   InspirationModel.find() 
   .then((data) => {
      console.log("Inspirations docs retrive promise resolved.");
      res.send(data);
   })
   .catch((err) => {
      console.log("Error while retrieving inpiration docs(in db): ", err);
      res.send("Error in retrieving inspiration list from database: ", err);
   });
});   
//add new inspiration
app.post("/inspirations", parser.single("image"), async function(req, res){
   console.log("POST request for /inspirations");
   console.log(req.body)

   const newInspiration = new InspirationModel({
      name: req.body.name,
      description: req.body.description,
      influenceField: req.body.influenceField
   });
   //save to db(returns promise)
   newInspiration.save()
      .then((data) => {
         console.log("Successully stored new inspiration(promise resolved)");
         res.send(`Successfulyl stored new inspiration, values: ${data}.`);
      })
      .catch((err) => {
         console.log("Error saving new inspiration(promise rejected): ", err);
         res.send(err);
      });
});

//get a specific inspiration by id
app.get("/inspirations/:id", (req, res) => {
   console.log("GET request for /inpirations/:id");
   
   InspirationModel.findById(req.params.id)
   .then((data) => {
      res.send(data);
   })
   .catch((err) => {
      res.send(`Error occured searching for the id provided: ${err}`);
   });
});

//delete a specific inspiration 
app.delete("/inspirations/:id", async (req, res) => {
   console.log("DELETE request for /inpirations/:id");
   try{
      const deletedInspiration = await InspirationModel.deleteOne({"_id": req.params.id});
      res.send(`Successfully deleted inspiration ${req.params.id}, count: ${deletedInspiration.deletedCount}.`);
      
   }catch(err){
      res.send(err);
   }
});

//update an inpiration
app.patch("/inspirations/:id", (req, res) => {
   console.log("PATCH request for /inspirations/:id");
   console.log(req.body)

   InspirationModel.updateOne({"_id": req.params.id}, 
      {$set: {"description": req.body.description}}
   )
   .then((data) => {
      console.log(data);
      res.send("Successfully updated inspiration");
   })
   .catch((err) => {
      res.send(`Error occured updating your inspiration: ${err}`);
   });
});   


//server start
app.listen(process.env.API_PORT, function(){
   console.log("Server is running!");
});