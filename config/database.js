const mongoose = require("mongoose");

exports.connect = () => {
  // Connecting to the database
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb://localhost:27017/beproject", {
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