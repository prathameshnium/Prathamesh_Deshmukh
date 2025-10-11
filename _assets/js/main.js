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
    // Populate mobile menu dynamically
    const isIndex = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
    const prefix = isIndex ? '' : '../';
    mobileMenu.innerHTML = `
        <a href="${prefix}index.html#about" class="block py-2 nav-link">About</a>
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
const portfolioButton = document.getElementById('portfolio-button');
const portfolioMenu = document.getElementById('portfolio-menu');

function toggleDropdown(menu, isVisible) {
    if (isVisible) {
        menu.classList.remove('hidden');
        // Focus the first item in the menu
        menu.querySelector('a, button')?.focus();
    } else {
        menu.classList.add('hidden');
    }
}

if (portfolioButton && portfolioMenu) {
    portfolioButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isHidden = portfolioMenu.classList.contains('hidden');
        toggleDropdown(portfolioMenu, isHidden);
    });

    portfolioMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    portfolioButton.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleDropdown(portfolioMenu, false);
        }
    });
}

// Close dropdown when clicking outside
window.addEventListener('click', () => {
    if (portfolioMenu && !portfolioMenu.classList.contains('hidden')) {
        toggleDropdown(portfolioMenu, false);
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
});


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
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            showMenu();
        } else {
            // Use a short timeout to allow the mouseleave to be cancelled if re-hovering
            setTimeout(() => menu.classList.add('hidden'), 100);
        }
    });

    // Close with Escape key
    container.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            menu.classList.add('hidden');
            button.focus();
        }
    });
}

setupDropdown('more-links-container', 'more-links-button', 'more-links-menu');
setupDropdown('footer-more-links-container', 'footer-more-links-button', 'footer-more-links-menu');

// Add scrolled class to header
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}