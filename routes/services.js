const express = require("express");
const router = express.Router();
const openUvService = require("../services/openUvService");
const airVisualService = require("../services/airVisualService");
const epicService = require("../services/epicService");
const { newsAPI, guardianAPI } = require("../services/newsService");

/* GET Open UV API (UV INDEX) */
router.get("/services/openuv", async (req, res, next) => {
  const result = await openUvService.getUvIndex(req.query.lat, req.query.lng);
  res.json({ uv: result });
});

/* GET AirVisual API (CONTAMINATION INDEX) */
router.get("/services/air", async (req, res, next) => {
  const result = await airVisualService.getAirIndex();
  res.json({ contam: result });
});

/* GET AirVisual API (TEMPERATURE) */
router.get("/services/temperature", async (req, res, next) => {
  const result = await airVisualService.getTemperature();
  res.json({ temp: result });
});

/* GET Epic NASA API (DATE OF PHOTO) */
router.get("/services/epic/lastPhoto", async (req, res, next) => {
  const result = await epicService.getLastPhoto();
  res.json({ photoUrl: result });
});

// GET News API
router.get("/services/news", async (req, res, next) => {
  try {
    const apiResponse = await newsAPI.getNews(
      '"greta%20thunberg"OR"climate%20change"OR"environment"&language=en'
    );

    const news = apiResponse.data.articles.map(article => {
      return {
        headline: article.title,
        body: article.description,
        pictureUrl: article.urlToImage,
        author: article.author,
        externalUrl: article.url,
        published: article.publishedAt
      };
    });

    res.json({ news });
  } catch (error) {
    console.log(error);
  }
});

// GET The Guardian API
router.get("/services/guardian", async (req, res, next) => {
  try {
    const guardianResponse = await guardianAPI.getNews(
      '&section=environment&q="climate%20change"&page-size=20&show-fields=headline,byline,thumbnail,bodyText,trailText'
    );

    const news = guardianResponse.data.response.results.map(article => {
      return {
        headline: article.fields.headline,
        body: article.fields.trailText,
        pictureUrl: article.fields.thumbnail,
        author: article.fields.byline,
        externalUrl: article.webUrl,
        published: article.webPublicationDate
      };
    });

    res.json({ news });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
