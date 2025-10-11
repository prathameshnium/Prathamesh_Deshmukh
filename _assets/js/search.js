document.addEventListener('DOMContentLoaded', () => {
    const searchIndexUrls = [
        '../_assets/search-index.json', 
        '../_assets/social-search-index.json'
    ];
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let searchIndex = [];
    let debounceTimer;

    // Fetch and combine search indexes on page load
    async function loadSearchIndex() {
        try {
            const responses = await Promise.all(searchIndexUrls.map(url => 
                fetch(url).catch(e => {
                    console.warn(`Could not fetch ${url}:`, e);
                    return { ok: false, json: () => Promise.resolve([]) }; // Return a mock response on network error
                })
            ));
            const data = await Promise.all(responses.map(res => res.ok ? res.json() : []));
            searchIndex = [].concat(...data); // Flatten the array of arrays
        } catch (error) {
            console.error('Error loading search index:', error);
            if (searchResults) {
                searchResults.innerHTML = '<p class="text-red-400">Could not load search index. Please try again later.</p>';
            }
        }
    }

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchResults.innerHTML = '<p>Please enter a search term.</p>';
            return;
        }

        if (searchIndex.length === 0) {
            searchResults.innerHTML = '<p>Search index is not available.</p>';
            return;
        }

        const results = searchIndex.filter(item => {
            const content = (item.title + ' ' + item.content).toLowerCase();
            return content.includes(query);
        });

        displayResults(results, query);
    }

    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found.</p>';
            return;
        }

        const resultsHtml = results.map(result => {
            const snippet = getSnippet(result.content, query);
            const isExternal = result.url.startsWith('http');
            const displayUrl = isExternal ? result.url : window.location.origin + result.url;

            return `
                <li class="mb-6">
                    <a href="${result.url}" 
                       class="text-xl text-accent-orange hover:underline" 
                       ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                       ${result.title} ${isExternal ? '<svg class="w-4 h-4 inline-block ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><use href="#icon-external-link-alt"></use></svg>' : ''}
                    </a>
                    <p class="text-light-slate mt-1">${snippet}</p>
                    <p class="text-sm text-slate mt-2 truncate">${displayUrl}</p>
                </li>`;
        }).join('');

        searchResults.innerHTML = `<ul class="space-y-4">${resultsHtml}</ul>`;
    }

    function getSnippet(content, query, contextLength = 80) {
        const lowerContent = content.toLowerCase();
        const index = lowerContent.indexOf(query);
        if (index === -1) return '';

        let start = Math.max(0, index - contextLength);
        let end = Math.min(content.length, index + query.length + contextLength);

        // Adjust start to the beginning of a word
        if (start > 0) {
            const spaceIndex = content.lastIndexOf(' ', start);
            start = spaceIndex > -1 ? spaceIndex + 1 : start;
        }

        // Adjust end to the end of a word
        if (end < content.length) {
            const spaceIndex = content.indexOf(' ', end);
            end = spaceIndex > -1 ? spaceIndex : end;
        }

        let snippet = content.substring(start, end);

        // Highlight the query term
        snippet = snippet.replace(new RegExp(query, 'gi'), (match) => `<strong class="text-accent-orange bg-accent-orange/10 px-1 rounded">${match}</strong>`);

        return `${start > 0 ? '...' : ''}${snippet}${end < content.length ? '...' : ''}`;
    }

    if (searchInput && searchResults) {
        // Load the index as soon as the page is ready
        loadSearchIndex();

        searchInput.addEventListener('keyup', (event) => {
            clearTimeout(debounceTimer);
            if (event.key === 'Enter') {
                performSearch();
            } else {
                debounceTimer = setTimeout(() => {
                    performSearch();
                }, 300); // Debounce for 300ms
            }
        });

        // Also handle search button click
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
    }
});