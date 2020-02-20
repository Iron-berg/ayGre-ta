// Functions related to DOM manipulation
const updateLink = () => {
	const navLinks = [ ...document.querySelectorAll('#navbar .nav-link') ];
	const currentLink = document.querySelector('a[href="' + location.pathname + '"]');
	navLinks.forEach(link => link.classList.remove('active'));
	if (location.pathname !== '/') {
		currentLink.classList.add('active');
	}
};

const formatNews = async () => {
	try {
		const articles = await getNewsArticles();
		return articles.map(article => {
			return {
				headline: article.title,
				body: article.description,
				pictureUrl: article.urlToImage,
				author: article.author,
				externalUrl: article.url
			};
		});
	} catch (error) {
		console.log(error);
	}
};

const populateCarousel = async () => {
	const articles = await formatNews();
	console.log(articles);
	articles.forEach((article, index) => {
		let container = document.createElement('div');
		container.setAttribute('class', `carousel-item ${index === 0 ? 'active': ''}`);
		container.innerHTML = `<div class="card bg-dark text-white">
															<img class="d-block w-100" src="${article.pictureUrl}">
															<div class="carousel-caption">
																<h4>${article.headline}</h4>
															</div>
													</div>`
													
		document.getElementById('carousel').appendChild(container);
	})
};

document.addEventListener(
	'DOMContentLoaded',
	() => {
		console.log('IronGenerator JS imported successfully!');
		updateLink();
		populateCarousel();
	},
	false
);
