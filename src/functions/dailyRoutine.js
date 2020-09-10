const User = require("../models/User");
const Activation = require("../models/Activator");

module.exports = {
  NotActivatedRemover: (ms) => {
    User.find({ activation: false }).then((user) => {
      for (let i = 0; i < user.length; ++i) {
        const userJoinDate = user[i].joined;
        const dateNow = new Date();

        if (userJoinDate.getUTCDate() + 7 <= dateNow.getUTCDate() + 1) {
          user.delete();
        }
      }
    });
  },
  checkActivationsReset: (ms) => {
    const dateNow = new Date();
    console.log(dateNow.getUTCHours() + 2);
    Activation.find({ type: "reset" }).then((data) => {
      for (let i = 0; i < data.length; ++i) {
        const activationCreated = data[i].created;

        if (dateNow.getUTCDate() + 1 !== activationCreated.getUTCDate()) {
        } else if (dateNow.getUTCMinutes()) {
        }
      }
    });
  },
};
