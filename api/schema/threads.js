const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const Threads = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: Array
  },
  email: {
    type: String
  },
  username: {
    type: ObjectId,
    ref: 'User',
    required: true
},
  date: {
    type: String,
    // `Date.now()` returns the current unix timestamp as a number
    default: new Date().toLocaleString()
  }

});


module.exports = mongoose.model("Threads", Threads);