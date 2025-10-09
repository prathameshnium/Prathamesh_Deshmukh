
// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Active nav link scrolling
const sections = document.querySelectorAll('main section');
const navLinks = document.querySelectorAll('nav a:not([href*="pages"])'); // Exclude external page links

window.addEventListener('scroll', () => {
    let current = 'about';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 70) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref.includes(current)) {
            link.classList.add('active');
        }
    });
});

// Robust script for clickable dropdown
const portfolioButton = document.getElementById('portfolio-button');
const portfolioMenu = document.getElementById('portfolio-menu');

portfolioButton.addEventListener('click', (event) => {
    event.stopPropagation();
    portfolioMenu.classList.toggle('hidden');
});

portfolioMenu.addEventListener('click', (event) => {
    event.stopPropagation();
});

window.addEventListener('click', () => {
    if (!portfolioMenu.classList.contains('hidden')) {
        portfolioMenu.classList.add('hidden');
    }
});

// Mobile portfolio accordion
const mobilePortfolioButton = document.getElementById('mobile-portfolio-button');
const mobilePortfolioMenu = document.getElementById('mobile-portfolio-menu');
mobilePortfolioButton.addEventListener('click', () => {
    mobilePortfolioMenu.classList.toggle('hidden');
    mobilePortfolioButton.querySelector('i').classList.toggle('fa-chevron-down');
    mobilePortfolioButton.querySelector('i').classList.toggle('fa-chevron-up');
});

// Function to handle dropdown menus
function setupDropdown(containerId, buttonId, menuId) {
    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    if (!container || !button || !menu) return;

    let menuTimeout;
    container.addEventListener('mouseenter', () => {
        clearTimeout(menuTimeout);
        menu.classList.remove('hidden');
    });
    container.addEventListener('mouseleave', () => {
        menuTimeout = setTimeout(() => menu.classList.add('hidden'), 300);
    });
}

setupDropdown('more-links-container', 'more-links-button', 'more-links-menu');
setupDropdown('footer-more-links-container', 'footer-more-links-button', 'footer-more-links-menu');

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
});
