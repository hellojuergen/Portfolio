document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('portfolio-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const lightbox = document.getElementById('lightbox');

    let displayed = 12;
    let current = 0;

    function esc(s) { const d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; }

    function render(count) {
        grid.innerHTML = '';
        const items = portfolioItems.slice(0, count);
        items.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'grid-item';
            el.style.gridRowEnd = 'span ' + (item.gridRowSpan || 30);
            el.innerHTML =
                '<img src="' + esc(item.image) + '" alt="' + esc(item.title) + '" loading="lazy" onerror="this.style.display=\'none\'">' +
                '<div class="grid-item-overlay"><h3 class="grid-item-title">' + esc(item.title) + '</h3></div>';
            el.addEventListener('click', () => openLightbox(i));
            grid.appendChild(el);
        });
        loadMoreBtn.style.display = portfolioItems.length <= count ? 'none' : 'block';
    }

    function openLightbox(i) {
        current = i;
        const item = portfolioItems[i];
        document.getElementById('lightbox-img').src = item.image;
        document.getElementById('lightbox-img').alt = item.title;
        document.getElementById('lightbox-title').textContent = item.title;
        document.getElementById('lightbox-subtitle').textContent = item.subtitle || '';

        // Beschreibung mit echten Zeilenumbrüchen
        const descEl = document.getElementById('lightbox-description');
        if (item.description) {
            descEl.innerHTML = item.description.split('\n').map(l => l === '' ? '<br>' : esc(l)).join('<br>');
        } else { descEl.innerHTML = ''; }

        // Meta: Client + Datum
        const meta = document.getElementById('lightbox-meta');
        const parts = [];
        if (item.client) parts.push('<span>' + esc(item.client) + '</span>');
        if (item.date) parts.push('<span>' + esc(item.date) + '</span>');
        meta.innerHTML = parts.join('<span class="meta-sep">&middot;</span>');

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', () => { current = (current - 1 + portfolioItems.length) % portfolioItems.length; openLightbox(current); });
    document.getElementById('lightbox-next').addEventListener('click', () => { current = (current + 1) % portfolioItems.length; openLightbox(current); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (!lightbox.classList.contains('active')) return; if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') { current = (current - 1 + portfolioItems.length) % portfolioItems.length; openLightbox(current); } if (e.key === 'ArrowRight') { current = (current + 1) % portfolioItems.length; openLightbox(current); } });

    loadMoreBtn.addEventListener('click', () => { displayed += 6; render(displayed); });

    render(displayed);
});
