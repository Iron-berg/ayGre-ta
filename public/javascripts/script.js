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
  const uvIndex = await getUvIndex(currentPost.latitude, currentPost.longitude);
  console.log("The UV Index is: " + uvIndex);

  let container = document.createElement("div");
  container.innerHTML = `<h1>${uvIndex}</h1>`;
  document.getElementById("data4").appendChild(container);
};

const updateContaminationIndex = async () => {
  const contamIndex = await getContaminationIndex();
  console.log("The air pollution Index is: " + contamIndex);

  let container = document.createElement("div");
  container.innerHTML = `<h1>${contamIndex}</h1>`;
  document.getElementById("data2").appendChild(container);
};

const updateTemperature = async () => {
  const temperature = await getTemperature();
  console.log("The temperature in Celsius is: " + temperature);

  let container = document.createElement("div");
  container.innerHTML = `<h1>${temperature}</h1>`;
  document.getElementById("data3").appendChild(container);
};

const updateEpicPhoto = async () => {
  const urlEpic = await getEpicPhoto();
  console.log("The URL of the Earth pic is: " + urlEpic);

  let container = document.createElement("div");
  container.innerHTML = `<img src="${urlEpic}" class="img-fluid" alt="The Earth">`;
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
