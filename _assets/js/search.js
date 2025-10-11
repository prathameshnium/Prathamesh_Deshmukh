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

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResults.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    searchResults.innerHTML = '<p>Searching...</p>';
    let results = [];

    for (const page of pagesToSearch) {
        try {
            const response = await fetch(page);
            if (!response.ok) continue;

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const title = doc.querySelector('title')?.innerText || '';
            const content = doc.body.innerText.toLowerCase();

            if (content.includes(query)) {
                results.push({
                    url: page.replace('..', ''),
                    title: title,
                    content: content
                });
            }
        } catch (error) {
            console.error('Error fetching or parsing page:', page, error);
        }
    }

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
        html += `<li class="mb-4">
            <a href="${result.url}" class="text-xl text-accent-orange hover:underline">${result.title}</a>
            <p class="text-light-slate">${snippet}</p>
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