const colors = require("colors");
module.exports = class Logger {
  static normal(body) {
    let d = new Date();
    console.log(
      colors.blue(
        `${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} | ${body}`
      )
    );
  }

  static warn(body) {
    let d = new Date();
    console.log(
      colors.red(
        `${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} | ${body}`
      )
    );
  }

  static debug(body) {
    let d = new Date();
    console.log(
      colors.green(
        `${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} | ${body}`
      )
    );
  }
};
