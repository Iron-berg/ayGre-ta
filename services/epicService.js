const axios = require("axios");

class EpicService {
  constructor() {
    this.service = axios.create({
      baseURL: "https://epic.gsfc.nasa.gov/api/natural/date"
    });
  }

  getLastPhoto() {
    return this.service
      .get()
      .then(response => {
        const photoName = response.data[0].image; // name of pic
        const photoDate = response.data[0].date; // date of pic
        return this.createPhotoUrl(photoName, photoDate);
      })
      .catch(error => console.log(`ERROR: ${error}`));
  }

  // Format url according to NASA API
  createPhotoUrl(photoName, photoDate) {
    const format = "jpg";
    const year = photoDate.substring(0, 4);
    const month = photoDate.substring(5, 7);
    const day = photoDate.substring(8, 10);

    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/${format}/${photoName}.${format}`;
  }
}

module.exports = new EpicService();
