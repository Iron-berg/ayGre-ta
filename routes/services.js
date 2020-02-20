const express = require("express");
const router = express.Router();
const openUvService = require("../services/openUvService");
const airVisualService = require("../services/airVisualService");
const epicService = require("../services/epicService");

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

/* GET Epic NASA API (DATE OF PHOTO) */
router.get("/services/epic/lastPhoto", async (req, res, next) => {
  const result = await epicService.getLastPhoto();
  res.json({ photoUrl: result });
});

module.exports = router;
