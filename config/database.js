const { default: mongoose } = require("mongoose");

const mongoURI = process.env.NODE_APP_MONGO_URI;

// ? ****************************************************** MongoDB Configuration ****************************************************** */
const mongoConnect = async () => {
  try {
    const connection = await mongoose.connect(mongoURI);
    console.log("Mongo Database connected Successfully!");
    return connection;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { mongoConnect };
