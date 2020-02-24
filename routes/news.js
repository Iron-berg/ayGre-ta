const express = require('express');
const router = express.Router();
const News = require('../models/news');
const User = require('../models/user');

// GET news page
router.get('/news', (req, res, next) => {
	res.render('news', { showTitle: true });
});

// GET favorite news page
router.get('/userFavs', (req, res, next) => {
	User.findById(req.user.id).populate('favoriteNews').exec((err, user) => {
		if (err) {
			console.log(err);
			return res.redirect('/user');
		} else {
			res.render('userFavs', { favNews: user.favoriteNews });
		}
	});
});

// POST - favorite news
router.post('/favorite', async (req, res, next) => {
	try {
		const { pictureUrl, headline, body, externalUrl, published, favorite } = req.body;
		const newsFaved = await News.findOne({ externalUrl });
		console.log('news exists', newsFaved);
		const currentUser = await User.findById(req.user.id);
		console.log(favorite);
		console.log(currentUser);
		if (!newsFaved) {
			const newsCreated = await News.create({ pictureUrl, headline, body, externalUrl, published });
			console.log('news added to ddbb', newsCreated);

			console.log('adding one!');
			await News.updateOne({ _id: newsCreated._id }, { $inc: { timesFavorited: 1 } });
			await currentUser.favoriteNews.push(newsCreated);
			console.log('saved in users array', currentUser);
		} else {
			console.log('already in the database, update it');
			if (favorite) {
				console.log('adding one!');
				await News.updateOne({ _id: newsFaved._id }, { $inc: { timesFavorited: 1 } });
				await currentUser.favoriteNews.push(newsFaved);
			} else {
				console.log('deleting from favorites, reducing by one and removing from users list');
				await News.updateOne({ _id: newsFaved._id }, { $inc: { timesFavorited: -1 } });
				await currentUser.favoriteNews.splice(currentUser.favoriteNews[newsFaved._id], 1);
			}
		}
		currentUser.save();

		res.json({ status: 'success' });
	} catch (error) {
		console.log(error);
		res.json({
			status: 'error'
		});
	}
});

module.exports = router;
