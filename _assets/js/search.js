const pagesToSearch = [
    '../index.html',
    '../pages/blog.html',
    '../pages/computational-works.html',
    '../pages/cv.html',
    '../pages/gallery.html',
    '../pages/presentations.html',
    '../pages/project-pica.html',
    '../pages/research.html',
    '../pages/resources.html',
    '../pages/sitemap.html',
    '../pages/Sudip_Mukherjee_Materials_Physics_Lab.html'
];

const socialIndexUrl = '../_assets/social-search-index.json';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

if (searchButton && searchInput && searchResults) {
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Perform search on page load if a query parameter is present
    window.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            searchInput.value = query;
            performSearch();
        }
    });
}

async function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResults.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    searchResults.innerHTML = '<p>Searching...</p>';
    const promises = [];

    // 1. Search social profiles from JSON
    promises.push(
        fetch(socialIndexUrl)
            .then(response => response.ok ? response.json() : [])
            .then(socialProfiles => socialProfiles.filter(profile => {
                const content = (profile.title + ' ' + profile.content).toLowerCase();
                return content.includes(query);
            }).map(profile => ({
                url: profile.url,
                title: profile.title,
                content: profile.content.toLowerCase()
            })))
            .catch(error => {
                console.error('Error fetching or parsing social index:', error);
                return []; // Return empty array on error
            })
    );

    // 2. Search HTML pages
    pagesToSearch.forEach(page => {
        promises.push(
            fetch(page)
                .then(response => response.ok ? response.text() : null)
                .then(html => {
                    if (!html) return null;

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const title = doc.querySelector('title')?.innerText || '';
                    const content = doc.body.innerText.toLowerCase();

                    if (content.includes(query)) {
                        return {
                            url: page.startsWith('..') ? page.substring(2) : page,
                            title: title,
                            content: content
                        };
                    }
                    return null;
                })
                .catch(error => {
                    console.error('Error fetching or parsing page:', page, error);
                    return null; // Return null on error
                })
        );
    });

    const results = (await Promise.all(promises)).flat().filter(Boolean);
    displayResults(results, query);
}

function displayResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = '<p>No results found.</p>';
        return;
    }

    let html = '<ul>';
    results.forEach(result => {
        const snippet = getSnippet(result.content, query);
        const isExternal = result.url.startsWith('http');
        html += `<li class="mb-4">
            <a href="${result.url}" class="text-xl text-accent-orange hover:underline" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>${result.title} ${isExternal ? '<i class="fas fa-external-link-alt text-sm ml-1"></i>' : ''}</a>
            <p class="text-light-slate">${snippet}</p>
            <p class="text-sm text-slate mt-1">${isExternal ? result.url : window.location.origin + result.url}</p>
        </li>`;
    });
    html += '</ul>';
    searchResults.innerHTML = html;
}

function getSnippet(content, query) {
    const index = content.indexOf(query);
    if (index === -1) return '';

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    let snippet = content.substring(start, end);

    // Highlight the query
    snippet = snippet.replace(new RegExp(query, 'gi'), (match) => `<strong class="text-accent-orange">${match}</strong>`);

    return `...${snippet}...`;
}