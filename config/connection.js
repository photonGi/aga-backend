const mongoose = require("mongoose");

require("dotenv").config();
const mongoURI =
  "mongodb+srv://junaidci100:fmhvRosgAn7JByYU@clusteragacrane.24qza.mongodb.net/agacrance?retryWrites=true&w=majority&appName=ClusterAgacrane";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      dbName: "agacrance",
    });
    console.log("DB connected");
  } catch (error) {
    console.error("Error connecting to DB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
