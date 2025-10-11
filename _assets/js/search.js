document.addEventListener('DOMContentLoaded', () => {
    const searchIndexUrls = [
        '../_assets/search-index.json', 
        '../_assets/social-search-index.json'
    ];
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchForm = document.getElementById('search-form');
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

    function performSearch(event) {
        if (event) event.preventDefault(); // Prevent form submission
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            // Clear results if the query is empty
            searchResults.innerHTML = '<h2 class="sr-only" id="search-results-status">Search Cleared</h2><p>Please enter a search term.</p>';
            return;
        }

        if (searchIndex.length === 0) {
            searchResults.innerHTML = '<h2 class="sr-only" id="search-results-status">Error</h2><p>Search index is not available.</p>';
            return;
        }

        // Provide immediate feedback to the user
        searchResults.innerHTML = `<h2 class="sr-only" id="search-results-status">Searching...</h2><p>Searching for "${query}"...</p>`;
        searchResults.setAttribute('aria-busy', 'true');

        // Perform the search
        const results = searchIndex.filter(item => {
            const content = (item.title + ' ' + item.content).toLowerCase();
            // Split query into words and check if all words are present
            return query.split(/\s+/).every(word => content.includes(word));
        });

        // Display results after a short delay to allow the UI to update
        displayResults(results, query);
        searchResults.setAttribute('aria-busy', 'false');
    }

    function displayResults(results, query) {
        const resultsCount = results.length;
        const statusMessage = `${resultsCount} ${resultsCount === 1 ? 'result' : 'results'} found for '${query}'`;

        if (results.length === 0) {
            searchResults.innerHTML = `<h2 class="sr-only" id="search-results-status">${statusMessage}</h2><p>No results found.</p>`;
            return;
        }

        const resultsHtml = results.map(result => {
            const snippet = getSnippet(result.content, query);
            const isExternal = result.url.startsWith('http');
            const displayUrl = isExternal ? result.url.replace(/^https?:\/\//, '') : window.location.origin + result.url;
            const externalIconSvg = `<svg class="w-4 h-4 inline-block ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`;

            return `
                <li class="mb-6">
                    <a href="${result.url}" 
                       class="text-xl text-accent-orange hover:underline" 
                       ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                       ${result.title} ${isExternal ? externalIconSvg : ''}
                    </a>
                    <p class="text-light-slate mt-1">${snippet}</p>
                    <p class="text-sm text-slate mt-2 truncate">${displayUrl}</p>
                </li>`;
        }).join('');

        searchResults.innerHTML = `
            <h2 class="sr-only" id="search-results-status">${statusMessage}</h2>
            <ul class="space-y-4">${resultsHtml}</ul>
        `;
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
        snippet = snippet.replace(new RegExp(query, 'gi'), (match) => `<mark class="bg-accent-orange/20 text-accent-orange rounded px-1">${match}</mark>`);

        return `${start > 0 ? '...' : ''}${snippet}${end < content.length ? '...' : ''}`;
    }

    if (searchForm && searchInput && searchResults) {
        // Load the index as soon as the page is ready
        loadSearchIndex();

        searchInput.addEventListener('keyup', (event) => {
            clearTimeout(debounceTimer);
            // Use a debounce to avoid searching on every keystroke
            debounceTimer = setTimeout(() => {
                performSearch();
            }, 300);
        });

        // Handle form submission (Enter key or button click)
        searchForm.addEventListener('submit', (event) => {
            clearTimeout(debounceTimer); // Cancel any pending debounced search
            performSearch(event);
        });
    }
});