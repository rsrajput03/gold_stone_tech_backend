const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  gender: String,
  status: String,
  Created_at: String,
  Updated_at: String,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
