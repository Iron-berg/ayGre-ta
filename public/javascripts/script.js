// Functions related to DOM manipulation
const updateLink = () => {
	const navLinks = [ ...document.querySelectorAll('#navbar .nav-link') ];
	const currentLink = document.querySelector('a[href="' + location.pathname + '"]');
	navLinks.forEach(link => link.classList.remove('active'));
	if (location.pathname !== '/') {
		currentLink.classList.add('active');
	}
};

const formatNewsApi = async () => {
	try {
		const articles = await getNewsArticles();
		return articles.map(article => {
			return {
				headline: article.title,
				body: article.description,
				pictureUrl: article.urlToImage,
				author: article.author,
				externalUrl: article.url,
				published: article.publishedAt
			};
		});
	} catch (error) {
		console.log(error);
	}
};

const formatNewsGuardian = async () => {
	try {
		const articles = await getguardianArticles();
		return articles.map(article => {
			return {
				headline: article.fields.headline,
				body: article.fields.trailText,
				pictureUrl: article.fields.thumbnail,
				author: article.fields.byline,
				externalUrl: article.webUrl,
				published: article.webPublicationDate
			};
		});
	} catch (error) {
		console.log(error);
	}
};

const populateCarousel = async () => {
	const articlesApi = await formatNewsApi();
	const articlesGuardian = await formatNewsGuardian()

	const articles = [...articlesApi, ...articlesGuardian].sort((a, b)=> new Date(b.published) - new Date(a.published));

	for(let i = 0; i <=5 ; i++){
		let container = document.createElement('div');

		container.setAttribute('class', `carousel-item ${i === 0 ? 'active': ''}`);
		container.innerHTML = `<div class="card bg-dark text-white">
															<img class="d-block w-100" src="${articles[i].pictureUrl}">
															<div class="carousel-caption">
																<h4>${articles[i].headline}</h4>
															</div>
													</div>`
													
		document.getElementById('carousel').appendChild(container);
	}
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
