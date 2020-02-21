// Functions related to DOM manipulation
const updateLink = () => {
	const navLinks = [ ...document.querySelectorAll('#navbar .nav-link') ];
	const currentLink = document.querySelector('a[href="' + location.pathname + '"]');
	navLinks.forEach(link => link.classList.remove('active'));
	if (location.pathname !== '/') {
		currentLink.classList.add('active');
	}
};

// Home page - News section
const fetchNews = async () => {
	const articlesApi = await getNewsArticles();
	const articlesGuardian = await getGuardianArticles();
	return [ ...articlesApi, ...articlesGuardian ].sort((a, b) => new Date(b.published) - new Date(a.published));
};

const populateCarousel = async () => {
	const articles = await fetchNews();
	for (let i = 0; i < 5; i++) {
		let container = document.createElement('div');

		container.setAttribute('class', `carousel-item ${i === 0 ? 'active' : ''}`);
		container.innerHTML = `<div class="card text-white">
															<img class="d-block w-100" src="${articles[i].pictureUrl}">
															<div class="carousel-caption">
																<h4>${articles[i].headline}</h4>
															</div>
													</div>`;

		document.getElementById('carousel').appendChild(container);
	}
};

document.addEventListener(
	'DOMContentLoaded',
	() => {
		console.log('IronGenerator JS imported successfully!');
		updateLink();
		if (location.pathname === '/') {
			populateCarousel();
		}
	},
	false
);
