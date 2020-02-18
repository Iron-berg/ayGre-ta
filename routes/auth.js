const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const { hashPassword } = require('../lib/hashing');

// Signup route
router.post('/', async (req, res, next) => {
	try {
		const { username, password, signup } = req.body;

		if (!signup) return next();

		const registeredUser = await User.findOne({ username });

		if (registeredUser) {
			console.log(`User ${registeredUser.username} already exists`);
			return res.redirect('/');
		} else {
			const newUser = await User.create({ username, password: hashPassword(password) });
			console.log(`${newUser} created`);
			return res.redirect('/');
		}
	} catch (error) {
		console.log('Credentials are necessary');
		return res.redirect('/');
	}
});

// Local login
router.post('/', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/' }));

module.exports = router;
