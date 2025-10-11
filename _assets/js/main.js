/**
 * Main JavaScript file for the portfolio website (Refactored for Performance and Modularity).
 * Handles preloader, theme toggling, navigation, dropdowns, custom cursor,
 * and other interactive elements.
 */

/**
 * Sets up the theme toggle functionality, allowing users to switch
 * between 'dark' and 'darker' themes and persisting the choice in localStorage.
 * @returns {void}
 */
function setupThemeToggle() {
    const themeToggleButtons = document.querySelectorAll('[data-theme-toggle]');
    const html = document.documentElement;

    // Simplified theme state
    let currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark

    const applyTheme = (newTheme) => {
        // Remove old theme class
        html.classList.remove('theme-darker');

        // Apply new theme class
        if (newTheme === 'darker') {
            html.classList.add('theme-darker');
        }

        // Update UI and save preference
        updateIcons(newTheme === 'darker' ? '#icon-sun' : '#icon-moon');
        localStorage.setItem('theme', newTheme);
        currentTheme = newTheme;
    };

    const updateIcons = (iconHref) => {
        themeToggleButtons.forEach(button => {
            const use = button.querySelector('use');
            if (use) use.setAttribute('href', iconHref);
        });
    };

    const toggleTheme = () => {
        const newTheme = currentTheme === 'dark' ? 'darker' : 'dark';
        applyTheme(newTheme);
    };

    themeToggleButtons.forEach(button => {
        button.addEventListener('click', toggleTheme);
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
    const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (!mobileMenuButton || !mobileMenu) return;

    // Find or create the overlay
    let overlay = document.querySelector('[data-menu-overlay]');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.setAttribute('data-menu-overlay', '');
        overlay.className = 'fixed inset-0 bg-black/60 z-30 opacity-0 transition-opacity duration-300 ease-in-out pointer-events-none md:hidden';
        document.body.appendChild(overlay);
    }

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('translate-x-0');
        overlay.classList.toggle('opacity-100');
        overlay.classList.toggle('pointer-events-auto');
        mobileMenuButton.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';

        if (isOpen) {
            // Focus the first focusable element in the menu
            mobileMenu.querySelector('a, button')?.focus();
        }
    };

    mobileMenuButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    return toggleMenu; // Return the function so it can be used by keyboard controls
}

/**
 * Sets up the IntersectionObserver to automatically highlight the active
 * navigation link in the header as the user scrolls through page sections.
 */
function setupActiveNavLinks() {
    // --- Active nav link scrolling using IntersectionObserver (more performant) ---
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('header nav a[href*="#"]');
    const navLinksMap = new Map();
    navLinks.forEach(link => {
        const hash = link.getAttribute('href');
        navLinksMap.set(hash, link);
    });

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '-80px 0px -50% 0px', // Adjust top margin for sticky header, and bottom margin
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = `#${entry.target.getAttribute('id')}`;
            const link = navLinksMap.get(id);

            if (entry.isIntersecting) {
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
    document.querySelectorAll('[data-dropdown-parent], [data-hover-parent]').forEach(parent => {
        const toggle = parent.querySelector('[aria-haspopup="true"]');
        const menu = parent.querySelector('.dropdown-menu');
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
            }, 150);
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
    const mobilePortfolioButton = document.querySelector('[data-mobile-accordion-button]');
    const mobilePortfolioMenu = document.querySelector('[data-mobile-accordion-menu]');
    const icon = mobilePortfolioButton?.querySelector('svg');

    if (mobilePortfolioButton && mobilePortfolioMenu) {
        mobilePortfolioButton.addEventListener('click', () => {
            const isExpanded = mobilePortfolioButton.getAttribute('aria-expanded') === 'true';
            mobilePortfolioButton.setAttribute('aria-expanded', !isExpanded);
            mobilePortfolioMenu.classList.toggle('hidden');
            icon?.classList.toggle('rotate-180');
        });
    }
}

/**
 * Sets up the "Back to Top" button, making it appear on scroll
 * and smoothly scrolling the page to the top when clicked.
 */
function setupBackToTopButton() {
    const backToTopButton = document.querySelector('[data-back-to-top]');

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
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

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

        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input[type="submit"], .tag');

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
    const allLinks = document.querySelectorAll('a[href]');

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
function setupKeyboardControls(toggleMobileMenu) {
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');

    document.addEventListener('keydown', (e) => {
        // Close menus with the Escape key
        if (e.key === 'Escape' || e.key === 'Esc') { // 'Esc' for older browsers
            // Close mobile menu if it's open
            if (mobileMenu && mobileMenu.classList.contains('translate-x-0')) {
                if (toggleMobileMenu) toggleMobileMenu();
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
 * Sets up "copy to clipboard" functionality for all code blocks
 * that have a copy button.
 */
function setupCopyCodeButtons() {
    const copyButtons = document.querySelectorAll('[data-copy-button]');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pre = button.closest('.relative')?.querySelector('pre');
            if (!pre) return;

            const code = pre.querySelector('code');
            const textToCopy = code ? code.innerText : pre.innerText;

            navigator.clipboard.writeText(textToCopy).then(() => {
                button.textContent = 'Copied!';
                button.classList.add('!bg-green-500');

                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('!bg-green-500');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                button.textContent = 'Error';
            });
        });
    });
}

/**
 * Sets up a scroll-triggered fade-in animation for elements
 * with the '.will-animate' class.
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Initializes syntax highlighting for code blocks using highlight.js.
 */
function setupSyntaxHighlighting() {
    // Check if hljs is available and there are blocks to highlight
    if (typeof hljs !== 'undefined' && document.querySelector('pre code')) {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}

/**
 * Main initialization function. Runs after the DOM is fully loaded.
 */
function main() {
    // Feature initializations
    const toggleMobileMenu = setupMobileMenu();
    setupThemeToggle();
    setupActiveNavLinks();
    setupDropdowns();
    setupMobileAccordion();
    setupBackToTopButton();
    setupCustomCursor();
    setupPageTransitions();
    setupKeyboardControls(toggleMobileMenu);
    setupScrollAnimations();
    setupCopyCodeButtons();
    setupSyntaxHighlighting();

    // Hide preloader after a short delay to ensure paint
    const preloader = document.querySelector('[data-preloader]');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        });
    }

    // Conditionally load search logic if on the search page
    if (document.querySelector('[data-search-form]')) {
        import('./search.js').then(module => module.default());
    }
}

/**
 * Entry point: run the main initialization function when the DOM is ready.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}