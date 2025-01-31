require('dotenv').config();
const mongoose = require('mongoose');
const mongodbString = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    
    await mongoose.connect(mongodbString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;