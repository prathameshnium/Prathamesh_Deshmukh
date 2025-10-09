// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}


// Active nav link scrolling for one-page navigation
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('header nav a[href^="#"]');

function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 70) {
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
}

// Only add scroll listener if there are nav links for on-page sections
if (navLinks.length > 0 && sections.length > 0) {
    window.addEventListener('scroll', updateActiveNavLink);
}


// Main portfolio dropdown (desktop)
const portfolioButton = document.getElementById('portfolio-button');
const portfolioMenu = document.getElementById('portfolio-menu');

if (portfolioButton && portfolioMenu) {
    portfolioButton.addEventListener('click', (event) => {
        event.stopPropagation();
        portfolioMenu.classList.toggle('hidden');
    });

    portfolioMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

// Close dropdown when clicking outside
window.addEventListener('click', () => {
    if (portfolioMenu && !portfolioMenu.classList.contains('hidden')) {
        portfolioMenu.classList.add('hidden');
    }
});


// Core portfolio submenu (desktop)
const corePortfolioItem = document.getElementById('core-portfolio-item');
const corePortfolioSubmenu = document.getElementById('core-portfolio-submenu');
let submenuTimeout;

if (corePortfolioItem && corePortfolioSubmenu) {
    corePortfolioItem.addEventListener('mouseenter', () => {
        clearTimeout(submenuTimeout);
        corePortfolioSubmenu.classList.remove('hidden');
    });

    corePortfolioItem.addEventListener('mouseleave', () => {
        submenuTimeout = setTimeout(() => {
            corePortfolioSubmenu.classList.add('hidden');
        }, 300);
    });

    corePortfolioSubmenu.addEventListener('mouseenter', () => {
        clearTimeout(submenuTimeout);
    });

    corePortfolioSubmenu.addEventListener('mouseleave', () => {
        corePortfolioSubmenu.classList.add('hidden');
    });
}


// Mobile portfolio accordion
const mobilePortfolioButton = document.getElementById('mobile-portfolio-button');
const mobilePortfolioMenu = document.getElementById('mobile-portfolio-menu');

if (mobilePortfolioButton && mobilePortfolioMenu) {
    mobilePortfolioButton.addEventListener('click', () => {
        mobilePortfolioMenu.classList.toggle('hidden');
        const icon = mobilePortfolioButton.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        }
    });
}


// Generic dropdown handler for "More Links"
function setupDropdown(containerId, buttonId, menuId) {
    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    if (!container || !button || !menu) return;

    let menuTimeout;

    const showMenu = () => {
        clearTimeout(menuTimeout);
        menu.classList.remove('hidden');
    };

    const hideMenu = () => {
        menuTimeout = setTimeout(() => menu.classList.add('hidden'), 300);
    };

    // Show on hover for desktop-like experiences
    container.addEventListener('mouseenter', showMenu);
    container.addEventListener('mouseleave', hideMenu);

    // Allow clicking on the button to toggle, for touch devices
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        menu.classList.toggle('hidden');
    });
}

setupDropdown('more-links-container', 'more-links-button', 'more-links-menu');
setupDropdown('footer-more-links-container', 'footer-more-links-button', 'footer-more-links-menu');