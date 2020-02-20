const express = require("express");
const router = express.Router();
const openUvService = require("../services/openUvService");
const airVisualService = require("../services/airVisualService");

/* GET Open UV API (UV INDEX) */
router.get("/services/openuv", async (req, res, next) => {
  const result = await openUvService.getUvIndex(req.query.lat, req.query.lng);
  res.json({ uv: result });
});

/* GET AirVsual API (CONTAMINATION INDEX) */
router.get("/services/air", async (req, res, next) => {
  const result = await airVisualService.getAirIndex();
  res.json({ contam: result });
});

module.exports = router;
