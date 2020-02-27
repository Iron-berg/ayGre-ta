const axios = require("axios");

class OpenUvService {
  constructor() {
    this.service = axios.create({
      //baseURL: "https://api.openuv.io/api/v1/uv",
      headers: { "x-access-token": process.env.API_SUN_TOKEN }
    });
  }

  getUvIndex(lat, lng) {
    return this.service
      .get("", {
        params: {
          lat: lat,
          lng: lng
        }
      })
      .then(response => {
        return this.formatIndex(response.data.result.uv); // returns the current contamination index
      })
      .catch(error => console.log(`ERROR: ${error}`));
  }

  formatIndex(index) {
    return Math.round((index + Number.EPSILON) * 10) / 10;
  }
}

module.exports = new OpenUvService();
