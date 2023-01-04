const express = require("express");
const mongoose = require("mongoose")
require("dotenv/config"); 
const InspirationModel = require("./models/Inspiration");
const bodyParser = require("body-parser");
const Inspiration = require("./models/Inspiration");
const path = require("path");

const app = express();

//DB connection
mongoose.set('strictQuery', false);

const connection = process.env.DB_CONNECTION;

mongoose.connect(connection)
   .then((res) => {
      console.log("Promise resolved, connected to db!");
   })
   .catch((err) => {
      console.log("Error in db connection: ", err);
   })

//middleware: esegue function quando client va su un route
app.use(bodyParser.json()); //middleware che viene eseguito ad ogni request, aiuta a lavorare con json
app.use(express.static("frontend"));

//routes 
app.get("/", function(req, res){
   console.log("GET request for /");
   const indexFileLocation = path.resolve("./frontend/index.html");
   //res.sendFile(indexFileLocation);
   res.send("ciao, no midlleware");
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

app.post("/inspirations", async function(req, res){
   console.log("POST request for /inspirations");

   const newInspiration = new InspirationModel({
      name: req.body.name,
      description: req.body.description,
      influenceField: req.body.influenceField
   });
   //save to db(returns promise)
   newInspiration.save()
      .then((data) => {
         console.log("Successully stored new inspiration(promise resolved)");
         res.send(`Stored: ${data}.`);
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
   try{
      const deletedInspiration = await InspirationModel.deleteOne({"_id": req.params.id});
      if(deletedInspiration.deletedCount == 0){
         res.send("No error occured, but No document has been deleted from the db (count=0)!");
      }else{
         res.send(`Successfully deleted inspiration ${req.params.id}, count: ${deletedInspiration.deletedCount}.`);
      }
   }catch(err){
      res.send(err);
   }
});

//update an inpiration
app.patch("/inspirations/:id", (req, res) => {
   InspirationModel.updateOne({"_id": req.params.id}, 
      {$set: {"description": req.body.description}}
   )
   .then((data) => {
      res.send("Successfully updated inspiration");
   })
   .catch((err) => {
      res.send(`Error occured updating your inspiration: ${err}`);
   });
});   


//server start
app.listen(3000, function(){
   console.log("Server is running!");
});