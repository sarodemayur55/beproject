const mongoose = require("mongoose");

exports.connect = () => {
  // Connecting to the database
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb+srv://mayur1310:mayur1310@cluster0.ctq8z.mongodb.net/beproject?retryWrites=true&w=majority", {
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