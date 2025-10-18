// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});

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
        // Dynamically populate the menu if it's empty
        if (portfolioMenu.innerHTML.trim() === '') {
            const isIndex = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
            const pagePrefix = isIndex ? 'pages/' : '';
            portfolioMenu.innerHTML = `
                <div id="core-portfolio-item" class="relative">
                    <a href="#" class="w-full text-left px-4 py-2 text-sm text-white hover:bg-accent-orange flex justify-between items-center">
                        Core Portfolio <i class="fas fa-chevron-right text-xs" aria-hidden="true"></i>
                    </a>
                    <div id="core-portfolio-submenu" class="absolute hidden dropdown-menu border border-gray-700 rounded-md shadow-lg py-2 w-48 top-0 left-full -mt-2 z-50">
                        <a href="${pagePrefix}research.html" class="block px-4 py-2 text-sm text-white hover:bg-accent-orange">Research & Pubs</a>
                        <div id="comp-works-item" class="relative">
                            <a href="${pagePrefix}computational-works.html" class="w-full text-left px-4 py-2 text-sm text-white hover:bg-accent-orange flex justify-between items-center">
                                Computational Works <i class="fas fa-chevron-right text-xs" aria-hidden="true"></i>
                            </a>
                            <div id="comp-works-submenu" class="absolute hidden dropdown-menu border border-gray-700 rounded-md shadow-lg py-2 w-48 top-0 left-full -mt-9 z-50">
                                <a href="${pagePrefix}computational-works.html" class="block px-4 py-2 text-sm text-white hover:bg-accent-orange">Overview</a>
                                <a href="${pagePrefix}project-pica.html" class="block px-4 py-2 text-sm text-white hover:bg-accent-orange">Project PICA</a>
                            </div>
                        </div>
                        <a href="${pagePrefix}presentations.html" class="block px-4 py-2 text-sm text-white hover:bg-accent-orange">Presentations</a>
                        <a href="${pagePrefix}cv.html" class="block px-4 py-2 text-sm text-white hover:bg-accent-orange">CV</a>
                    </div>
                </div>
                <div class="border-t border-gray-600 my-1"></div>
                <a href="${pagePrefix}blog.html" class="block px-4 py-2 text-sm text-white hover:bg-accent-orange">Blog</a>
                <a href="${pagePrefix}gallery.html" class="block px-4 py-2 text-sm text-white hover:bg-accent-orange">Gallery</a>
                <a href="${pagePrefix}resources.html" class="block px-4 py-2 text-sm text-white hover:bg-accent-orange">Resources</a>
            `;
            // Re-run the submenu setup for the newly added elements
            setupDesktopSubmenus();
        }
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


// Mobile portfolio accordion
document.addEventListener('DOMContentLoaded', () => {
    // Use event delegation for mobile accordions
    document.body.addEventListener('click', (event) => {
        const button = event.target.closest('#mobile-portfolio-button, #mobile-comp-works-button, #mobile-additional-button, #portfolio-button-mobile');
        if (button) {
            const menu = document.getElementById(button.getAttribute('aria-controls'));
            const icon = button.querySelector('i');
            const isExpanded = menu.classList.toggle('hidden');
            button.setAttribute('aria-expanded', !isExpanded);
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        }
    });

    // Generic Desktop Submenu Handler
    function setupDesktopSubmenus() {
        const menuItems = document.querySelectorAll('header nav .relative');

        menuItems.forEach(item => {
            const menu = item.querySelector('.dropdown-menu');
            if (!menu) return;

            let timeout;

            item.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                // Hide any other open submenus at the same level
                const parent = item.parentElement;
                parent.querySelectorAll(':scope > .relative > .dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.add('hidden');
                });
                menu.classList.remove('hidden');
            });

            item.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    menu.classList.add('hidden');
                }, 200); // A small delay to allow moving mouse to submenu
            });
        });
    }

    setupDesktopSubmenus();
});


// Generic dropdown handler for "More Links"
function setupDropdown(containerId, buttonId, menuId) {
    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    if (!container || !button || !menu) {
        return;
    }

    let menuTimeout; // For handling hover behavior

    // Function to show the menu
    const showMenu = () => {
        clearTimeout(menuTimeout); // Cancel any pending hide actions
        menu.classList.remove('hidden');
        button.setAttribute('aria-expanded', 'true');
    };

    // Function to hide the menu
    const hideMenu = (immediate = false) => {
        if (immediate) {
            menu.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
        } else {
            menuTimeout = setTimeout(() => {
                menu.classList.add('hidden');
                button.setAttribute('aria-expanded', 'false');
            }, 200); // Delay to allow moving mouse into the menu
        }
    };

    // Event listeners for hover
    container.addEventListener('mouseenter', showMenu);
    container.addEventListener('mouseleave', () => hideMenu());

    // Event listener for click (for touch devices and accessibility)
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent window click listener from closing it immediately
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            showMenu();
        } else {
            hideMenu(true); // Hide immediately on click
        }
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!container.contains(event.target)) {
            hideMenu(true);
        }
    });

    // Accessibility: Close with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
            hideMenu(true);
            button.focus(); // Return focus to the button
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

// Add copy-to-clipboard button for code blocks
document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach(block => {
        // Create a wrapper and button
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group';

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy mr-2"></i> Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');

        // Structure: wrapper -> button, pre
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        wrapper.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code')?.innerText || block.innerText;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check mr-2"></i> Copied!';
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy mr-2"></i> Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            });
        });
    });
});