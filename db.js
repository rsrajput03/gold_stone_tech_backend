const { default: mongoose } = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://rohit:rohit@cluster0.21xyzgb.mongodb.net/"
);

module.exports = {connection}
