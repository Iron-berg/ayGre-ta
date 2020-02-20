// Functions related to DOM manipulation
const updateLink = () => {
	const navLinks = [ ...document.querySelectorAll('#navbar .nav-link') ];
	const currentLink = document.querySelector('a[href="' + location.pathname + '"]');
	navLinks.forEach(link => link.classList.remove('active'));
	if (location.pathname !== '/') {
		currentLink.classList.add('active');
	}
};

document.addEventListener(
	'DOMContentLoaded',
	() => {
		console.log('IronGenerator JS imported successfully!');
		updateLink();
		getNews();
	},
	false
);
