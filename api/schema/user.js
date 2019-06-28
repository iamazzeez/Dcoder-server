const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    _id: ObjectId,
    email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      }
});

module.exports = mongoose.model("User", UserSchema);