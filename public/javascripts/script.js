const navLinks = [...document.querySelectorAll('#navbar .nav-link')]
const currentLink = document.querySelector('a[href="' + location.pathname + '"]')

console.log(location)

document.addEventListener('DOMContentLoaded', () => {
  console.log('IronGenerator JS imported successfully!');
  navLinks.forEach(link => link.classList.remove('active'));  
  currentLink.classList.add('active');
}, false);
