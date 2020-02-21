function getGeolocation() {
  // Try to get a geolocation object from the web browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        // Create an object to match Google's Lat-Lng object format
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log("center: ", center);
      },
      function() {
        console.log("Error in the geolocation service.");
      }
    );
  } else {
    console.log("Browser does not support geolocation.");
  }
}
