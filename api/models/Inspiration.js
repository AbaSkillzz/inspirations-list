const mongoose = require("mongoose");

const inspirationSchema = mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   influenceField: {
      type: String,
      require: false,
      default: "self improvement"
   }
});

//export a mongoose model, with a schema attached to the model 
module.exports = mongoose.model("InspirationModel", inspirationSchema);
