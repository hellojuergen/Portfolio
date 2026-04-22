document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('portfolio-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const loadMoreBtn = document.querySelector('.btn-load-more');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    let currentImageIndex = 0;
    let displayedItems = 12;

    function initPortfolio() {
        renderPortfolio();
        setupEventListeners();
    }

    function renderPortfolio(itemsToShow = displayedItems) {
        grid.innerHTML = '';
        const itemsToRender = portfolioItems.slice(0, itemsToShow);
        itemsToRender.forEach((item, index) => {
            grid.appendChild(createGridItem(item, index));
        });
        loadMoreBtn.style.display = portfolioItems.length <= itemsToShow ? 'none' : 'block';
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str)));
        return div.innerHTML;
    }

    function createGridItem(item, index) {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.style.gridRowEnd = `span ${item.gridRowSpan || 30}`;
        div.dataset.index = index;
        div.innerHTML = `
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy"
                 onerror="this.style.display='none'">
            <div class="grid-item-overlay">
                <h3 class="grid-item-title">${escapeHtml(item.title)}</h3>
            </div>
        `;
        div.addEventListener('click', () => openLightbox(index));
        return div;
    }

    function setupEventListeners() {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        });

        loadMoreBtn.addEventListener('click', () => {
            displayedItems += 6;
            renderPortfolio(displayedItems);
        });

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    function openLightbox(index) {
        currentImageIndex = index;
        const item = portfolioItems[index];

        lightboxImg.src = item.image;
        lightboxImg.alt = item.title;

        // Titel + Subtitle
        lightboxTitle.textContent = item.title;

        const subtitle = document.getElementById('lightbox-subtitle');
        if (subtitle) subtitle.textContent = item.subtitle || '';

        // Beschreibung: \n → <br> für korrekte Zeilenumbrüche
        if (item.description) {
            lightboxDescription.innerHTML = item.description
                .split('\n')
                .map(line => line === '' ? '<br>' : escapeHtml(line))
                .join('<br>');
        } else {
            lightboxDescription.innerHTML = '';
        }

        // Meta: Client + Datum
        const meta = document.getElementById('lightbox-meta');
        if (meta) {
            const parts = [];
            if (item.client) parts.push(`<span>${escapeHtml(item.client)}</span>`);
            if (item.date)   parts.push(`<span>${escapeHtml(item.date)}</span>`);
            meta.innerHTML = parts.join('<span class="meta-sep">·</span>');
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        lightboxImg.src = '';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + portfolioItems.length) % portfolioItems.length;
        openLightbox(currentImageIndex);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % portfolioItems.length;
        openLightbox(currentImageIndex);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    setTimeout(() => {
        document.querySelectorAll('.grid-item').forEach(item => observer.observe(item));
    }, 100);

    initPortfolio();
});
