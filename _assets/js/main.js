// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) { 
        preloader.style.opacity = '0';
        preloader.addEventListener('transitionend', () => preloader.style.display = 'none');
    }
});

// Theme Toggle
function applyTheme(theme) {
    const html = document.documentElement;
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    if (theme === 'darker') {
        html.classList.add('theme-darker');
        document.querySelectorAll('#theme-toggle, #mobile-theme-toggle').forEach(btn => {
            btn.innerHTML = sunIcon + '<span class="sr-only">Toggle Theme</span>';
        });
    } else {
        html.classList.remove('theme-darker');
        document.querySelectorAll('#theme-toggle, #mobile-theme-toggle').forEach(btn => {
            btn.innerHTML = moonIcon + '<span class="sr-only">Toggle Theme</span>';
        });
    }
    localStorage.setItem('theme', theme);
}

function setupThemeToggle() {
    const themeToggleButtons = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
    
    themeToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'darker' : 'dark';
            applyTheme(newTheme);
        });
    });

    // Apply saved theme on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Default to dark theme if no preference is saved
        applyTheme('dark');
    }
}

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    // Populate mobile menu dynamically
    const isIndex = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
    const prefix = isIndex ? '' : '../';
    mobileMenu.innerHTML = `
        <a href="${prefix}index.html" class="block py-2 nav-link">Home</a>
        <a href="${prefix}index.html#research" class="block py-2 nav-link">Research</a>
        <a href="${prefix}index.html#skills" class="block py-2 nav-link">Skills</a>
        <a href="${prefix}index.html#journey" class="block py-2 nav-link">Journey</a>
        <a href="${prefix}index.html#contact" class="block py-2 nav-link">Contact</a>
        <div class="border-t border-gray-700 my-2"></div>
        <div>
            <button id="mobile-portfolio-button" class="w-full text-left py-2 nav-link flex justify-between items-center">
                <span>Portfolio</span>
                <i class="fas fa-chevron-down text-xs"></i>
            </button>
            <div id="mobile-portfolio-menu" class="hidden pl-4">
                <a href="${prefix}pages/research.html" class="block py-2 nav-link">Research & Pubs</a>
                <a href="${prefix}pages/computational-works.html" class="block py-2 nav-link">Computational Works</a>
                <a href="${prefix}pages/presentations.html" class="block py-2 nav-link">Presentations</a>
                <a href="${prefix}pages/cv.html" class="block py-2 nav-link">CV</a>
                <a href="${prefix}pages/blog.html" class="block py-2 nav-link">Blog</a>
                <a href="${prefix}pages/gallery.html" class="block py-2 nav-link">Gallery</a>
                <a href="${prefix}pages/resources.html" class="block py-2 nav-link">Resources</a>
            </div>
        </div>
        <div class="border-t border-gray-700 my-2"></div>
        <button id="mobile-theme-toggle" class="w-full text-left py-2 nav-link flex justify-between items-center">
            <span>Toggle Theme</span>
            <i class="fas fa-moon"></i>
        </button>
    `;

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
document.addEventListener('DOMContentLoaded', () => {
    // Desktop dropdown
    const portfolioButton = document.getElementById('portfolio-button');
    const portfolioMenu = document.getElementById('portfolio-menu');
    let portfolioTimeout;
    if (portfolioButton && portfolioMenu) {
        const parent = portfolioButton.parentElement;
        parent.addEventListener('mouseenter', () => {
            clearTimeout(portfolioTimeout);
            portfolioMenu.classList.remove('hidden');
        });
        parent.addEventListener('mouseleave', () => {
            portfolioTimeout = setTimeout(() => {
                portfolioMenu.classList.add('hidden');
            }, 300);
        });
        portfolioMenu.addEventListener('mouseenter', () => clearTimeout(portfolioTimeout));
        portfolioMenu.addEventListener('mouseleave', () => portfolioMenu.classList.add('hidden'));
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
document.addEventListener('DOMContentLoaded', () => {
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
        }
    )}

    // Initialize theme toggle functionality
    setupThemeToggle();
});