// Main JavaScript für Portfolio
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const grid = document.getElementById('portfolio-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const loadMoreBtn = document.querySelector('.btn-load-more');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    let currentImageIndex = 0;
    let displayedItems = 12;

    // Initialize Portfolio
    function initPortfolio() {
        console.log('Initialisiere Portfolio mit', portfolioItems.length, 'Bildern');
        renderPortfolio();
        setupEventListeners();
    }

    // Render Portfolio Items
    function renderPortfolio(itemsToShow = displayedItems) {
        grid.innerHTML = '';
        
        // Show items
        const itemsToRender = portfolioItems.slice(0, itemsToShow);
        
        console.log('Zeige', itemsToRender.length, 'von', portfolioItems.length, 'Bildern');
        
        itemsToRender.forEach((item, index) => {
            const gridItem = createGridItem(item, index);
            grid.appendChild(gridItem);
        });

        // Show/hide load more button
        if (portfolioItems.length <= itemsToShow) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Create Grid Item
    function createGridItem(item, index) {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.style.gridRowEnd = `span ${item.gridRowSpan}`;
        div.dataset.index = index;
        
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy" 
                 onerror="this.src='./assets/img/placeholder.jpg'">
            <div class="grid-item-overlay">
                <h3 class="grid-item-title">${item.title}</h3>
            </div>
        `;

        div.addEventListener('click', () => openLightbox(index));
        
        return div;
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        });

        // Load more
        loadMoreBtn.addEventListener('click', () => {
            displayedItems += 6;
            renderPortfolio(displayedItems);
        });

        // Hamburger menu
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input').value;
                alert(`Vielen Dank für Ihre Anmeldung: ${email}`);
                e.target.reset();
            });
        }

        // Smooth scroll for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // Lightbox Functions
    function openLightbox(index) {
        currentImageIndex = index;
        const item = portfolioItems[index];
        
        lightboxImg.src = item.image;
        lightboxTitle.textContent = item.title;
        lightboxDescription.textContent = item.description;
        lightboxDate.textContent = item.date;
        
        // Verstecke Kategorie-Feld
        if (lightboxCategory) {
            lightboxCategory.style.display = 'none';
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + portfolioItems.length) % portfolioItems.length;
        openLightbox(currentImageIndex);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % portfolioItems.length;
        openLightbox(currentImageIndex);
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe grid items after rendering
    setTimeout(() => {
        document.querySelectorAll('.grid-item').forEach(item => {
            observer.observe(item);
        });
    }, 100);

    // Initialize
    initPortfolio();
});

// Performance: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
