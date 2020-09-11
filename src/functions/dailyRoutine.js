const User = require("../models/User");
const Activation = require("../models/Activator");

function deleteSixten(number) {
  if (number >= 60) {
    return (number - 60);
  }
  return number;
}

module.exports = {
  /**
   *
   * @param ms The ms for the interval.
   */
  NotActivatedRemover: (ms) => {
    setInterval(() => {
      User.find({ activation: false }).then((user) => {
        for (let i = 0; i < user.length; ++i) {
          const userJoinDate = user[i].joined;
          const dateNow = new Date();

          if (userJoinDate.getUTCDate() + 7 <= dateNow.getUTCDate() + 1) {
            user.delete();
          }
        }
      });
    }, ms);
  },
  /**
   *
   * @param ms The ms for the interval.
   */
  checkActivationsReset: (ms) => {
    setInterval(() => {
      Activation.find({ type: "reset" }).then((data) => {
        for (let i = 0; i < data.length; ++i) {
          const activationCreated = data[i].created;
          const dateNow = new Date();
          if (
            (dateNow.getUTCHours() + 2) >=
              (activationCreated.getUTCHours() + 2) &&
            (dateNow.getUTCHours() + 2) !==
              (activationCreated.getUTCHours() + 2)
          ) {
            //Delete it
            Activation.deleteOne({ _id: data[i].id });
          } else if (
            deleteSixten(activationCreated.getMinutes() + 15) >=
              activationCreated.getUTCMinutes()
          ) {
            //Delete it.
            Activation.deleteOne({ _id: data[i].id });
          } else {
            return;
          }
        }
      });
    }, ms);
  },
};
