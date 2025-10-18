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
        const isExpanded = mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
        // Toggle icon
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.toggle('fa-bars', isExpanded);
        icon.classList.toggle('fa-times', !isExpanded);
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

// Mobile portfolio accordion
document.addEventListener('DOMContentLoaded', () => {
    // Close dropdowns when clicking outside
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            // Check if the click is outside the menu and its corresponding button
            const parent = menu.closest('.relative.group');
            if (parent && !parent.contains(e.target)) {
                menu.classList.add('hidden');
                const button = parent.querySelector('button');
                if (button) button.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Use event delegation for mobile accordions
    document.body.addEventListener('click', (event) => {
        const button = event.target.closest('#mobile-portfolio-button, #mobile-comp-works-button, #mobile-additional-button, #portfolio-button-mobile');
        if (button) {
            const menu = document.getElementById(button.getAttribute('aria-controls'));
            const icon = button.querySelector('i');
            const isExpanded = menu.classList.toggle('hidden');
            button.setAttribute('aria-expanded', String(!isExpanded));
            if (icon) {
                icon.classList.toggle('fa-chevron-down', isExpanded);
                icon.classList.toggle('fa-chevron-up', !isExpanded);
            }
        }
    });
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