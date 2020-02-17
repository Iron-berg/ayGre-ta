const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { hashPassword } = require('../lib/hashing');

router.post('/', async (req, res) => {
	try {
		const { username, password } = req.body;
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

module.exports = router;
