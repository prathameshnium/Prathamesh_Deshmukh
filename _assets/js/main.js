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

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Slide-in Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Create and inject the overlay
    const overlay = document.createElement('div');
    overlay.id = 'menu-overlay';
    document.body.appendChild(overlay);

    const toggleMenu = () => {
        mobileMenu.classList.toggle('is-open');
        overlay.classList.toggle('is-open');
    };

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu); // Close menu when clicking overlay
    }

    // --- Active nav link scrolling using IntersectionObserver (more performant) ---
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('header nav a[href^="#"]');
    const navLinksMap = new Map();
    navLinks.forEach(link => {
        const hash = link.getAttribute('href');
        navLinksMap.set(hash, link);
    });

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '-70px 0px -50% 0px', // Adjust top margin for sticky header, and bottom margin
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = `#${entry.target.getAttribute('id')}`;
            const link = navLinksMap.get(id);

            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                // Remove active from all
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active to the current one
                if (link) {
                    link.classList.add('active');
                }
            }
        });
    }, observerOptions);

    if (navLinks.length > 0 && sections.length > 0) {
        sections.forEach(section => observer.observe(section));
    }

    // --- Desktop Dropdowns ---
    // Main portfolio dropdown (desktop)
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

    // --- Mobile portfolio accordion ---
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

    // Initialize theme toggle functionality
    setupThemeToggle();

    // --- Back to Top Button Logic ---
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});