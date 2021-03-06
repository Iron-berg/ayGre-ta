const express = require('express');
const router = express.Router();
const News = require('../models/news');
const User = require('../models/user');

// GET news page
router.get('/news', (req, res) => {
	res.render('news', { showTitle: true });
});

// GET favorite news page
router.get('/userFavs', (req, res) => {
	User.findById(req.user.id).populate('favoriteNews').exec((err, user) => {
		if (err) {
			console.log(err);
			return res.redirect('/user');
		} else {
			const newsOrdered = user.favoriteNews.sort(
				(a, b) => b.timesFavorited - a.timesFavorited || new Date(b.published) - new Date(a.published)
			);

			console.log('rendering user favs', user.favoriteNews);
			res.render('userFavs', { favNews: newsOrdered });
		}
	});
});

// POST - favorite news
router.post('/favorite', async (req, res) => {
	try {
		const { pictureUrl, headline, author, body, externalUrl, published, favorite } = req.body;
		const newsFaved = await News.findOne({ externalUrl });
		console.log('news exists', newsFaved);
		const currentUser = await User.findById(req.user.id);

		if (!newsFaved) {
			const newsCreated = await News.create({ pictureUrl, headline, author, body, externalUrl, published });
			console.log('news added to ddbb', newsCreated);

			console.log('adding one!');
			await News.updateOne({ _id: newsCreated._id }, { $inc: { timesFavorited: 1 } });
			await currentUser.favoriteNews.push(newsCreated);
			newsCreated.save();

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
				console.log(currentUser.favoriteNews[newsFaved._id]);
				await currentUser.favoriteNews.splice(currentUser.favoriteNews.indexOf(newsFaved._id), 1);
			}
			newsFaved.save();
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

// POST - unfave user's news
router.post('/user/favs', async (req, res) => {
	try {
		const { externalUrl } = req.body;
		const newsUnfave = await News.findOne({ externalUrl });
		const currentUser = await User.findById(req.user.id);

		await News.updateOne({ _id: newsUnfave._id }, { $inc: { timesFavorited: -1 } });
		await currentUser.favoriteNews.splice(currentUser.favoriteNews.indexOf(newsUnfave._id), 1);

		console.log(`updating ${currentUser} and ${newsUnfave}`);

		currentUser.save();
		newsUnfave.save();

		res.json({ status: 'success' });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
