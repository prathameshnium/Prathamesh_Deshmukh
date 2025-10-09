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

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        // Check if mobile menu content needs to be injected
        if (mobileMenu.innerHTML.trim() === '') {
            mobileMenu.innerHTML = `
                <a href="/index.html#about" class="block py-2 nav-link">About</a>
                <a href="/index.html#research" class="block py-2 nav-link">Research</a>
                <a href="/index.html#skills" class="block py-2 nav-link">Skills</a>
                <a href="/index.html#journey" class="block py-2 nav-link">Journey</a>
                <a href="/index.html#contact" class="block py-2 nav-link">Contact</a>
                <div class="border-t border-gray-700 my-2"></div>
                <div>
                    <button id="mobile-portfolio-button" class="w-full text-left py-2 nav-link flex justify-between items-center">
                        <span>Portfolio</span>
                        <i class="fas fa-chevron-down text-xs"></i>
                    </button>
                    <div id="mobile-portfolio-menu" class="hidden pl-4">
                        <a href="/pages/research.html" class="block py-2 nav-link">Research & Pubs</a>
                        <a href="/pages/computational-works.html" class="block py-2 nav-link">Computational Works</a>
                        <a href="/pages/presentations.html" class="block py-2 nav-link">Presentations</a>
                        <a href="/pages/cv.html" class="block py-2 nav-link">CV</a>
                        <a href="/pages/blog.html" class="block py-2 nav-link">Blog</a>
                        <a href="/pages/gallery.html" class="block py-2 nav-link">Gallery</a>
                        <a href="/pages/resources.html" class="block py-2 nav-link">Resources</a>
                    </div>
                </div>
            `;
        }

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Mobile portfolio accordion
    // Use event delegation for dynamically added elements
    document.body.addEventListener('click', (event) => {
        const mobilePortfolioButton = event.target.closest('#mobile-portfolio-button');
        if (mobilePortfolioButton) {
            const mobilePortfolioMenu = document.getElementById('mobile-portfolio-menu');
            const icon = mobilePortfolioButton.querySelector('i');
            if (mobilePortfolioMenu) {
                mobilePortfolioMenu.classList.toggle('hidden');
            }
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        }
    });

    // Desktop dropdown
    const portfolioButton = document.getElementById('portfolio-button');
    const portfolioMenu = document.getElementById('portfolio-menu');
    if (portfolioButton && portfolioMenu) {
        portfolioButton.addEventListener('click', (event) => {
            event.stopPropagation();
            portfolioMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (event) => {
            if (!portfolioMenu.contains(event.target) && !portfolioButton.contains(event.target)) {
                portfolioMenu.classList.add('hidden');
            }
        });
    }

    // Desktop submenu logic
    const corePortfolioItem = document.getElementById('core-portfolio-item');
    const corePortfolioSubmenu = document.getElementById('core-portfolio-submenu');
    if (corePortfolioItem && corePortfolioSubmenu) {
        corePortfolioItem.addEventListener('mouseenter', () => corePortfolioSubmenu.classList.remove('hidden'));
        corePortfolioItem.addEventListener('mouseleave', () => corePortfolioSubmenu.classList.add('hidden'));
    }
});