// Display data fetched from APIs
const updateUvIndex = async () => {
  const currentPost = await geolocation;
  let uvIndex = await getUvIndex(currentPost.latitude, currentPost.longitude);
  if (uvIndex === undefined) uvIndex = 0; // FAKE DATA... shhh

  let container = document.createElement("div");
  container.innerHTML = `<p class="legend">UV Index</p>
                         <p><img src="images/sun.png" width="50%" height="50%" align="middle" class="img-fluid" alt="Air pollution"> ${uvIndex}</p>`;

  document.getElementById("data4").appendChild(container);
};

const updateContaminationIndex = async () => {
  let contamIndex = await getContaminationIndex();
  if (contamIndex === undefined) contamIndex = 45; // FAKE DATA... shhh

  let container = document.createElement("div");
  container.innerHTML = `<p class="legend">Air Pollution</p>
                        <p><img src="images/air.png" width="50%" height="50%" align="middle" class="img-fluid" alt="Air pollution"> ${contamIndex}</p>`;
  document.getElementById("data2").appendChild(container);
};

const updateTemperature = async () => {
  let temperature = await getTemperature();
  if (temperature === undefined) temperature = 10; // FAKE DATA... shhh

  let container = document.createElement("div");
  container.innerHTML = `<p class="legend">Temperature</>
                          <p>${temperature} <img src="images/celsius.png" width="30%" height="30%" align="middle" class="img-fluid" alt="Air pollution"></p>`;
  document.getElementById("data3").appendChild(container);
};

const updateEpicPhoto = async () => {
  const urlEpic = await getEpicPhoto();

  let container = document.createElement("div");
  container.innerHTML = `<img src="${urlEpic}" id="earth" class="img-fluid" alt="The Earth">`;
  document.getElementById("data1").appendChild(container);
};
