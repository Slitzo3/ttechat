const User = require('../models/User');

module.exports = {
    NotActivatedRemover: () => {
        User.find({ activation: false }).then(user => {
            for(let i = 0; i < user.length; ++i) {
                const userJoinDate = user[i].joined;
                const dateNow = new Date
                
                if(userJoinDate.getUTCDate()+7 <= dateNow.getUTCDate()+1) {
                    user.delete()
                } else {
                    console.log(`User: ${user[i].username} wont get oof'ed`)
                }
            }
        })
    }
}