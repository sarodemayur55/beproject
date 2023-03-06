const mongoose = require("mongoose");
require('dotenv').config()
exports.connect = () => {
  // Connecting to the database
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
    //   process.exit(1);
    });
};