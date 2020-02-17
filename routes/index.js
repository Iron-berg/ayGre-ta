const express = require('express');
const router = express.Router();

// use routes
const auth = require('./auth');
router.use('/', auth);

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

module.exports = router;
