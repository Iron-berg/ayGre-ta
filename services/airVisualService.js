const axios = require("axios");

class AirVisualService {
  constructor() {
    this.service = axios.create({
      baseURL:
        "https://api.airvisual.com/v2/nearest_city?key=" +
        process.env.API_AIR_TOKEN
    });
  }

  getAirIndex() {
    let result = "";

    return this.service
      .get()
      .then(response => {
        result = response.data;
        return result.data.current.pollution.aqius; // returns the current contamination index
      })
      .catch(error => console.log(`ERROR: ${error}`));
  }
}

module.exports = new AirVisualService();
