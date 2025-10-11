/**
 * Main JavaScript file for the portfolio website.
 * Handles preloader, theme toggling, navigation, dropdowns, custom cursor,
 * and other interactive elements.
 */

/**
 * Sets up the theme toggle functionality, allowing users to switch
 * between 'dark' and 'darker' themes and persisting the choice in localStorage.
 * @returns {void}
 */
function setupThemeToggle() {
    const themeToggleButtons = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
    const html = document.documentElement;

    const theme = {
        current: localStorage.getItem('theme') || 'system',
        icons: {
            dark: '#icon-moon',
            darker: '#icon-sun'
        }
    };

    const applyTheme = (newTheme) => {
        // Remove old theme class
        html.classList.remove('theme-darker');

        // Apply new theme class
        if (newTheme === 'darker') {
            html.classList.add('theme-darker');
        }

        // Update UI and save preference
        updateIcons(newTheme);
        localStorage.setItem('theme', newTheme);
        theme.current = newTheme;
    };

    const updateIcons = (currentTheme) => {
        const iconHref = theme.icons[currentTheme] || theme.icons.dark;
        themeToggleButtons.forEach(button => {
            const use = button.querySelector('use');
            if (use) use.setAttribute('href', iconHref);
        });
    };

    themeToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newTheme = theme.current === 'dark' ? 'darker' : 'dark';
            applyTheme(newTheme);
        });
    });

    // Apply initial theme based on saved preference or system setting
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to 'dark'
    applyTheme(savedTheme);
}

/**
 * Sets up the mobile menu, including the slide-in/out behavior and overlay.
 */
function setupMobileMenu() {
    // --- Mobile Menu Slide-in Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenuButton || !mobileMenu) return;

    // Find or create the overlay
    let overlay = document.getElementById('menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'menu-overlay';
        overlay.className = 'fixed inset-0 bg-black/60 z-40 opacity-0 transition-opacity duration-300 ease-in-out pointer-events-none md:hidden';
        document.body.appendChild(overlay);
    }

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        overlay.classList.toggle('is-open');
        mobileMenuButton.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';

        if (isOpen) {
            // Optional: focus the first focusable element in the menu
            mobileMenu.querySelector('a, button')?.focus();
        }
    };

    mobileMenuButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
}

/**
 * Sets up the IntersectionObserver to automatically highlight the active
 * navigation link in the header as the user scrolls through page sections.
 */
function setupActiveNavLinks() {
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
}

/**
 * Sets up generic dropdown functionality for desktop and footer menus,
 * handling mouse hover and keyboard focus events for accessibility.
 */
function setupDropdowns() {
    document.querySelectorAll('[data-dropdown-parent]').forEach(parent => {
        const toggle = parent.querySelector('[data-dropdown-toggle]');
        const menu = parent.querySelector('[data-dropdown]');
        let timeout;

        if (!toggle || !menu) return;

        const showMenu = () => {
            clearTimeout(timeout);
            menu.classList.remove('hidden');
            toggle.setAttribute('aria-expanded', 'true');
        };

        const hideMenu = () => {
            timeout = setTimeout(() => {
                menu.classList.add('hidden');
                toggle.setAttribute('aria-expanded', 'false');
            }, 200);
        };

        parent.addEventListener('mouseenter', showMenu);
        parent.addEventListener('mouseleave', hideMenu);
        parent.addEventListener('focusin', showMenu); // For keyboard accessibility
        parent.addEventListener('focusout', (e) => {
            // Hide if focus moves outside the parent container
            if (!parent.contains(e.relatedTarget)) {
                hideMenu();
            }
        });
    });
}

/**
 * Sets up the accordion functionality for the portfolio section
 * within the mobile menu.
 */
function setupMobileAccordion() {
    const mobilePortfolioButton = document.getElementById('mobile-portfolio-button');
    const mobilePortfolioMenu = document.getElementById('mobile-portfolio-menu');

    if (mobilePortfolioButton && mobilePortfolioMenu) {
        mobilePortfolioButton.addEventListener('click', () => {
            const isExpanded = mobilePortfolioButton.getAttribute('aria-expanded') === 'true';
            mobilePortfolioButton.setAttribute('aria-expanded', !isExpanded);
            mobilePortfolioMenu.classList.toggle('hidden');
        });
    }
}

/**
 * Sets up the "Back to Top" button, making it appear on scroll
 * and smoothly scrolling the page to the top when clicked.
 */
function setupBackToTopButton() {
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
}

/**
 * Sets up the custom cursor, including its movement and interaction
 * states (hover, click) for a more engaging user experience.
 * This is a progressive enhancement and is disabled on touch devices via CSS.
 */
function setupCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            // Use transform for better performance
            const transformValue = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorDot.style.transform = transformValue;
            
            // Use Web Animations API for the outline for smooth trailing effect
            cursorOutline.animate(
                { transform: transformValue }, 
                { duration: 500, fill: 'forwards' }
            );
        });

        const interactiveElements = document.querySelectorAll('a, button, .cta-button, .social-icon, .nav-link');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });

        document.addEventListener('mousedown', () => {
            cursorOutline.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            cursorOutline.classList.remove('click');
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.display = '';
            cursorOutline.style.display = '';
        });
    }
}

/**
 * Sets up smooth page transitions by adding a fade-out effect
 * when navigating between internal pages.
 */
function setupPageTransitions() {
    const allLinks = document.querySelectorAll('a');

    allLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');

            // Check for conditions where we should NOT intercept the click
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank' || e.ctrlKey || e.metaKey) {
                return;
            }

            // For internal links, trigger the fade-out
            e.preventDefault();
            document.body.classList.add('is-leaving');

            setTimeout(() => {
                window.location = href;
            }, 300); // This duration should match the CSS transition duration
        });
    });

    // On page load, remove the 'is-leaving' class in case it was cached by the browser (e.g., on back/forward)
    document.body.classList.remove('is-leaving');
}

/**
 * Sets up global keyboard controls for accessibility, such as
 * closing menus with the Escape key.
 */
function setupKeyboardControls() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');

    document.addEventListener('keydown', (e) => {
        // Close menus with the Escape key
        if (e.key === 'Escape' || e.key === 'Esc') { // 'Esc' for older browsers
            // Close mobile menu
            if (mobileMenu && mobileMenu.classList.contains('is-open')) {
                toggleMenu();
                mobileMenuButton.focus(); // Return focus to the button
            }
            // Close desktop dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
                const toggle = menu.closest('[data-dropdown-parent]')?.querySelector('[data-dropdown-toggle]');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    // Check if the menu had focus, and if so, return focus to the toggle button
                    if (menu.contains(document.activeElement)) {
                        toggle.focus();
                    }
                }
            });
        }
    });
}

/**
 * Main initialization function. Runs after the DOM is fully loaded.
 */
function init() {
    // Asynchronously load and inject the SVG sprite
    const svgContainer = document.getElementById('svg-sprite-container');
    if (svgContainer) {
        fetch('/_assets/icons.svg')
            .then(response => response.text())
            .then(data => {
                svgContainer.innerHTML = data;
            }).catch(error => {
                console.error('Error loading SVG sprite:', error);
            });
    }

    // Hide preloader as soon as the DOM is ready for faster perceived load time
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        });
    }

    // Initialize all features
    setupThemeToggle();
    setupMobileMenu();
    setupActiveNavLinks();
    setupDropdowns();
    setupMobileAccordion();
    setupBackToTopButton();
    setupCustomCursor();
    setupPageTransitions();
    setupKeyboardControls();
}

/**
 * Entry point: run the main initialization function when the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', init);
});