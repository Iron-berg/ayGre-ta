// Display data fetched from APIs
const updateUvIndex = async () => {
	const currentPost = await geolocation;
	let uvIndex = await getUvIndex(currentPost.latitude, currentPost.longitude);
	console.log('The UV Index is: ' + uvIndex);
	if (uvIndex === undefined) uvIndex = 1.6; // FAKE DATA... shhh

	let container = document.createElement('div');
	container.innerHTML = `<p class="legend">UV Index</p>
                         <p><img src="images/sun.png" width="50%" height="50%" align="middle" class="img-fluid" alt="Air pollution"> ${uvIndex}</p>`;

	document.getElementById('data4').appendChild(container);
};

const updateContaminationIndex = async () => {
	let contamIndex = await getContaminationIndex();
	console.log('The air pollution Index is: ' + contamIndex);
	if (contamIndex === undefined) contamIndex = 55; // FAKE DATA... shhh

	let container = document.createElement('div');
	container.innerHTML = `<p class="legend">Air Pollution</p>
                        <p><img src="images/air.png" width="50%" height="50%" align="middle" class="img-fluid" alt="Air pollution"> ${contamIndex}</p>`;
	document.getElementById('data2').appendChild(container);
};

const updateTemperature = async () => {
	let temperature = await getTemperature();
	console.log('The temperature in Celsius is: ' + temperature);
	if (temperature === undefined) temperature = 20; // FAKE DATA... shhh

	let container = document.createElement('div');
	container.innerHTML = `<p class="legend">Temperature</>
                          <p>${temperature} <img src="images/celsius.png" width="30%" height="30%" align="middle" class="img-fluid" alt="Air pollution"></p>`;
	document.getElementById('data3').appendChild(container);
};

const updateEpicPhoto = async () => {
	const urlEpic = await getEpicPhoto();
	console.log('The URL of the Earth pic is: ' + urlEpic);

	let container = document.createElement('div');
	container.innerHTML = `<img src="${urlEpic}" id="earth" class="img-fluid" alt="The Earth">`;
	document.getElementById('data1').appendChild(container);
};
