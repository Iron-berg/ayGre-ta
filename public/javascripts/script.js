// Functions related to DOM manipulation
const updateLink = () => {
  const navLinks = [...document.querySelectorAll("#navbar .nav-link")];
  const currentLink = document.querySelector(
    'a[href="' + location.pathname + '"]'
  );
  navLinks.forEach(link => link.classList.remove("active"));
  if (location.pathname !== "/") {
    currentLink.classList.add("active");
  }
};

const populateCarousel = async () => {
  const articlesApi = await getNewsArticles();
  const articlesGuardian = await getguardianArticles();
  const articles = [...articlesApi, ...articlesGuardian].sort(
    (a, b) => new Date(b.published) - new Date(a.published)
  );
  console.log(articles);

  for (let i = 0; i < 5; i++) {
    let container = document.createElement("div");

    container.setAttribute("class", `carousel-item ${i === 0 ? "active" : ""}`);
    container.innerHTML = `<div class="card text-white">
															<img class="d-block w-100" src="${articles[i].pictureUrl}">
															<div class="carousel-caption">
																<h4>${articles[i].headline}</h4>
															</div>
													</div>`;

    document.getElementById("carousel").appendChild(container);
  }
};

const updateUvIndex = async () => {
  const currentPost = await geolocation;
  let uvIndex = await getUvIndex(currentPost.latitude, currentPost.longitude);
  console.log("The UV Index is: " + uvIndex);
  //uvIndex = 1.6; // FAKE DATA
  if (uvIndex === undefined) uvIndex = "-";

  let container = document.createElement("div");
  container.innerHTML = `<p><img src="images/sun.png" width="50%" height="50%" align="middle" class="img-fluid" alt="Air pollution"> ${uvIndex}</p>`;
  document.getElementById("data4").appendChild(container);
};

const updateContaminationIndex = async () => {
  let contamIndex = await getContaminationIndex();
  console.log("The air pollution Index is: " + contamIndex);
  //contamIndex = 55; // FAKE DATA
  if (contamIndex === undefined) contamIndex = "-";

  let container = document.createElement("div");
  container.innerHTML = `<p><img src="images/air.png" width="50%" height="50%" align="middle" class="img-fluid" alt="Air pollution"> ${contamIndex}</p>`;
  document.getElementById("data2").appendChild(container);
};

const updateTemperature = async () => {
  let temperature = await getTemperature();
  console.log("The temperature in Celsius is: " + temperature);
  //temperature = 20; // FAKE DATA
  if (temperature === undefined) temperature = "-";

  let container = document.createElement("div");
  container.innerHTML = `<p>${temperature} <img src="images/celsius.png" width="30%" height="30%" align="middle" class="img-fluid" alt="Air pollution"></p>`;
  document.getElementById("data3").appendChild(container);
};

const updateEpicPhoto = async () => {
  const urlEpic = await getEpicPhoto();
  console.log("The URL of the Earth pic is: " + urlEpic);

  let container = document.createElement("div");
  container.innerHTML = `<img src="${urlEpic}" id="earth" class="img-fluid" alt="The Earth">`;
  document.getElementById("data1").appendChild(container);
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
    updateLink();
    populateCarousel();
    updateUvIndex();
    updateContaminationIndex();
    updateEpicPhoto();
    updateTemperature();
  },
  false
);
