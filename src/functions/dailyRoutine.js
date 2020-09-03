const User = require('../models/User');

module.exports = {
    NotActivatedRemover: () => {
        User.find({ activation: false }).then(user => {
            for(let i = 0; i < user.length; ++i) {
                const userJoinDate = user[i].joined;
                const dateNow = new Date
                console.log(userJoinDate.toLocaleDateString())
                console.log(dateNow.toLocaleDateString())
                if(true) {
    
                }
            }

        })
    }
}