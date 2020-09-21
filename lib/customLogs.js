const colors = require("colors");
const LogsDB = require("../models/Logs");

module.exports = class Logger {
  static normal(body) {
    let d = new Date();
    console.log(
      colors.blue(
        `${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} | ${body}`
      )
    );
    new LogsDB({
      body: body,
      type: "normal",
    }).save();
  }

  static warn(body) {
    let d = new Date();
    console.log(
      colors.red(
        `${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} | ${body}`
      )
    );
    new LogsDB({
      body: body,
      type: "warn",
    }).save();
  }

  static debug(body) {
    let d = new Date();
    console.log(
      colors.green(
        `${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} | ${body}`
      )
    );
    new LogsDB({
      body: body,
      type: "debug",
    }).save();
  }
};
