const express = require('express');
const router = express.Router();
const openUvService = require('../services/openUvService');
const airVisualService = require('../services/airVisualService');
const epicService = require('../services/epicService');
const mongoService = require('../services/mongoService');
const { newsAPI, guardianAPI } = require('../services/newsService');
const News = require('../models/news');
const mongoose = require('mongoose');

/* GET Open UV API (UV INDEX) */
router.get('/services/openuv', async (req, res, next) => {
	const result = await openUvService.getUvIndex(req.query.lat, req.query.lng);
	res.json({ uv: result });
});

/* GET AirVisual API (CONTAMINATION INDEX) */
router.get('/services/air', async (req, res, next) => {
	const result = await airVisualService.getAirIndex();
	res.json({ contam: result });
});

/* GET AirVisual API (TEMPERATURE) */
router.get('/services/temperature', async (req, res, next) => {
	const result = await airVisualService.getTemperature();
	res.json({ temp: result });
});

/* GET Epic NASA API (DATE OF PHOTO) */
router.get('/services/epic/lastPhoto', async (req, res, next) => {
	const result = await epicService.getLastPhoto();
	res.json({ photoUrl: result });
});

// GET News API
router.get('/services/news', async (req, res, next) => {
	try {
		const result = await newsAPI.getNews('"greta%20thunberg"OR"climate%20change"OR"environment"&language=en');

		const news = result.data.articles.map(article => {
			return {
				headline: article.title,
				body: article.description,
				pictureUrl: article.urlToImage,
				author: article.author,
				externalUrl: article.url,
				published: article.publishedAt
			};
		});
		const favoritesId = req.user
			? req.user.favoriteNews.map(id => {
					return mongoose.Types.ObjectId(id);
				})
			: [];
		const favoriteNews = await News.find({ _id: { $in: favoritesId } });

		res.json({
			news,
			isLoggedNews: req.user ? true : false,
			uniqueIdsApi: favoriteNews.map(news => news.externalUrl)
		});
	} catch (error) {
		console.log(error);
		res.json({
			news: null
		});
	}
});

// GET The Guardian API
router.get('/services/guardian', async (req, res, next) => {
	try {
		const result = await guardianAPI.getNews(
			'&section=environment&q="climate%20change"&page-size=20&show-fields=headline,byline,thumbnail,bodyText,trailText'
		);

		const guardianNews = result.data.response.results.map(article => {
			return {
				headline: article.fields.headline,
				body: article.fields.trailText,
				pictureUrl: article.fields.thumbnail,
				author: article.fields.byline,
				externalUrl: article.webUrl,
				published: article.webPublicationDate
			};
		});
		const favoritesId = req.user
			? req.user.favoriteNews.map(id => {
					return mongoose.Types.ObjectId(id);
				})
			: [];
		const favoriteNews = await News.find({ _id: { $in: favoritesId } });
		const newsSaved = await News.find();
		res.json({
			guardianNews,
			isLoggedGuardian: req.user ? true : false,
			uniqueIdsGuardian: favoriteNews.map(news => news.externalUrl),
			newsSaved: newsSaved.map(news => {
				return { externalUrl: news.externalUrl, timesFavorited: news.timesFavorited };
			})
		});
	} catch (error) {
		console.log(error);
		res.json({
			guardianNews: null
		});
	}
});

/* GET Users from DDBB by name */
router.get('/ddbb/findUsersByName/:name', async (req, res, next) => {
	const usr = await mongoService.getUsersByName(req.params.name);
	res.json(JSON.stringify(usr));
});

/* POST add following to user in DDBB by ids */
router.get('/ddbb/addFollowing', async (req, res, next) => {
	const response = await mongoService.addFollowed(req.query.following, req.query.currentUser);
	res.json(response);
});

module.exports = router;
