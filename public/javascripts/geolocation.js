// This method gets the current position of the client
const geolocation = new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    position => {
      resolve(position.coords);
    },
    error => {
      reject(error);
    }
  );
}).catch(error => error);
