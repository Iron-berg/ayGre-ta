const express = require('express');
const router = express.Router();

// use routes
const auth = require('./auth');
router.use('/', auth);
const services = require('./services');
router.use('/', services);

const news = require('./news');
router.use('/', news);

// GET home page
router.get('/', (req, res, next) => {
	res.render('index', { showTitle: true });
});

// GET about page
router.get('/about', (req, res, next) => {
	res.render('about');
});

// GET user page
router.get('/user', (req, res, next) => {
	res.render('user');
});

module.exports = router;
