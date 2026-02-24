const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully: ", conn.connection.host);
  } catch (error) {
    console.error("DB connection failed: ", error);
    process.exit(1);
  }
}

module.exports = connectDB;