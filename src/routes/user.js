const express = require('express');
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('./user/edit')
});

module.exports = router;
