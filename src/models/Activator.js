const mongoose = require("mongoose");

const activationSchema = new mongoose.Schema({
  conf: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Activation = mongoose.model("Activation", activationSchema);

module.exports = Activation;
