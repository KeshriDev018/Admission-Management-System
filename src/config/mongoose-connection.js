const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;







// const mongoose = require('mongoose');
// const config = require('config');

// const dbgr = require('debug')("development:mongoose");

// mongoose.connect(`${config.get("MONGODB_URI")}/ApplicationSystem`)
//     .then(function(){
//         dbgr("Connected")
//     })
//     .catch(function(err){
//         dbgr(err);
//         console.log("MongoDB connection error:", err);
//     });

// module.exports = mongoose.connection;