const mongoose = require("mongoose");

const logsSchema = new mongoose.Schema({
  body: {
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

const Logger = mongoose.model("Logs", logsSchema);

module.exports = Logger;
