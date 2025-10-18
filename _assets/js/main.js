// Preloader Fade Out
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add a fade-out effect for a smoother transition
        preloader.style.opacity = '0';
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        });
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

// Generic dropdown handler
function setupDropdown(containerId, buttonId, menuId) {
    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    if (!container || !button || !menu) return;

    const allSubmenus = container.querySelectorAll('.dropdown-menu');

    const handleSubmenu = (parentItem) => {
        const submenu = parentItem.querySelector('.dropdown-menu');
        if (!submenu) return;

        let timeout;
        parentItem.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            submenu.classList.remove('hidden');
        });
        parentItem.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => submenu.classList.add('hidden'), 200);
        });
    };

    container.querySelectorAll('.relative.group\\/core, .relative.group\\/comp').forEach(handleSubmenu);

    const toggleMenu = (show) => {
        const isHidden = menu.classList.contains('hidden');
        if (show === true || (show === undefined && isHidden)) {
            menu.classList.remove('hidden');
            button.setAttribute('aria-expanded', 'true');
        } else if (show === false || (show === undefined && !isHidden)) {
            menu.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
            // Ensure all submenus are hidden when the main menu closes
            allSubmenus.forEach(submenu => submenu.classList.add('hidden'));
        }
    };

    let mainTimeout;
    container.addEventListener('mouseenter', () => { clearTimeout(mainTimeout); toggleMenu(true); });
    container.addEventListener('mouseleave', () => { mainTimeout = setTimeout(() => toggleMenu(false), 200); });
    button.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            toggleMenu(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
            toggleMenu(false);
            button.focus();
        }
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
    // --- Initializations ---
    setupDropdown('more-links-container', 'more-links-button', 'more-links-menu');
    setupDropdown('footer-more-links-container', 'footer-more-links-button', 'footer-more-links-menu');
    setupDropdown('portfolio-dropdown-container', 'portfolio-button', 'portfolio-menu');

    // --- Search Modal ---
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input-modal');
    const searchResultsContainer = document.getElementById('search-results-modal');
    const openSearchButtons = document.querySelectorAll('.open-search-modal');
    const closeSearchButton = document.getElementById('close-search-modal');
    let searchIndex = [];
    let lastActiveElement;

    if (searchModal && openSearchButtons.length && closeSearchButton) {
        // Fetch the search index
        fetch('/_assets/js/search-index.json')
            .then(response => response.json())
            .then(data => {
                searchIndex = data;
            })
            .catch(error => console.error('Error loading search index:', error));

        function openModal() {
            lastActiveElement = document.activeElement;
            searchModal.classList.remove('hidden');
            searchModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('overflow-hidden');
            searchInput.focus();
        }

        function closeModal() {
            searchModal.classList.add('hidden');
            searchModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('overflow-hidden');
            searchInput.value = '';
            searchResultsContainer.innerHTML = '<p class="text-slate">Start typing to search the site.</p>';
            if (lastActiveElement) {
                lastActiveElement.focus();
            }
        }

        openSearchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });

        closeSearchButton.addEventListener('click', closeModal);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
                closeModal();
            }
        });

        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                closeModal();
            }
        });

        function performSearch() {
            const query = searchInput.value.toLowerCase().trim();

            if (query.length < 2) {
                searchResultsContainer.innerHTML = '<p class="text-slate">Please enter at least 2 characters.</p>';
                return;
            }

            const results = searchIndex.filter(item =>
                item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
            );

            displayResults(results, query);
        }

        function displayResults(results, query) {
            if (results.length === 0) {
                searchResultsContainer.innerHTML = '<p class="text-slate">No results found.</p>';
                return;
            }

            const highlight = (text, term) => {
                const regex = new RegExp(`(${term})`, 'gi');
                return text.replace(regex, '<mark class="bg-accent-orange/50 text-white not-italic rounded-sm px-1">$1</mark>');
            };

            searchResultsContainer.innerHTML = results.map(result => {
                const contentLower = result.content.toLowerCase();
                const index = contentLower.indexOf(query);
                const start = Math.max(0, index - 50);
                const end = Math.min(contentLower.length, index + query.length + 150);
                let snippet = result.content.substring(start, end);
                if (start > 0) snippet = '...' + snippet;
                if (end < contentLower.length) snippet += '...';

                return `
                    <a href="${result.url}" class="block p-4 rounded-lg hover:bg-slate/20 transition-colors">
                        <h3 class="text-lg font-semibold text-accent-orange mb-1">${highlight(result.title, query)}</h3>
                        <p class="text-sm text-light-slate">${highlight(snippet, query)}</p>
                    </a>
                `;
            }).join('');
        }

        searchInput.addEventListener('input', performSearch);
    }

    // Mobile accordions
    document.body.addEventListener('click', (event) => {
        const button = event.target.closest('#mobile-portfolio-button, #mobile-comp-works-button, #mobile-additional-button, #portfolio-button-mobile');
        if (button) {
            const menu = document.getElementById(button.getAttribute('aria-controls'));
            const icon = button.querySelector('i');
            if (menu) {
                const isExpanded = menu.classList.toggle('hidden');
                button.setAttribute('aria-expanded', String(!isExpanded));
                if (icon) {
                    icon.classList.toggle('fa-chevron-down', isExpanded);
                    icon.classList.toggle('fa-chevron-up', !isExpanded);
                }
            }
        }
    });

    // Copy-to-clipboard for code blocks
    document.querySelectorAll('pre').forEach(block => {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group';

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy mr-2"></i> Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');

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

// --- Sitemap/Pages List Loader ---
async function loadPagesList() {
    const pagesListContainer = document.getElementById('pages-list');
    if (!pagesListContainer) return;

    try {
        const response = await fetch('/sitemap.xml');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const sitemapText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(sitemapText, 'application/xml');
        const urls = xmlDoc.getElementsByTagName('url');

        let html = '';
        Array.from(urls).forEach(urlNode => {
            const loc = urlNode.getElementsByTagName('loc')[0].textContent;
            // Extract a user-friendly name from the URL
            let name = loc.split('/').pop().replace('.html', '').replace(/_/g, ' ');
            if (name === '' || name === 'index') {
                name = 'Home Page';
            } else {
                // Capitalize first letter of each word
                name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }

            html += `
                <a href="${loc}" class="sitemap-link rounded-md flex justify-between items-center">
                    <span>${name}</span>
                    <i class="fas fa-arrow-right text-xs text-slate"></i>
                </a>
            `;
        });

        pagesListContainer.innerHTML = html;
    } catch (error) {
        console.error('Failed to load and parse sitemap.xml:', error);
        pagesListContainer.innerHTML = '<p class="text-light-slate text-center text-red-400">Could not load page list.</p>';
    }
}

// --- Publications Loader ---
async function loadPublications() {
    const container = document.getElementById('publications-list');
    if (!container) return;

    try {
        const response = await fetch('/_assets/data/publications.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const publications = await response.json();
        
        const featuredPubs = publications.filter(pub => pub.homepage);

        if (featuredPubs.length === 0) {
            container.innerHTML = '<p class="text-light-slate text-center col-span-full">No featured publications available at the moment.</p>';
            return;
        }

        const html = featuredPubs.map(pub => `
            <div class="card p-6 rounded-lg flex flex-col">
                <p class="mb-2 text-light-slate flex-grow">${pub.authors} (${pub.year}). "${pub.title}."</p>
                <p class="italic text-slate mb-3">${pub.journal}${pub.details ? `, ${pub.details}` : ''}.</p>
                ${pub.doi ? `
                <a href="${pub.doi}" target="_blank" rel="noopener noreferrer" class="publication-link font-medium mt-auto">
                    View Article <i class="fas fa-external-link-alt ml-1 text-xs" aria-hidden="true"></i>
                </a>` : `
                <span class="text-slate font-medium mt-auto">Details upon request</span>
                `}
            </div>
        `).join('');

        container.innerHTML = html;
    } catch (error) {
        console.error("Could not load publications:", error);
        container.innerHTML = '<p class="text-red-400 text-center col-span-full">Failed to load publications.</p>';
    }
}

// Run loaders on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadPagesList();
    loadPublications();
});