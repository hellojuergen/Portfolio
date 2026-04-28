'use strict';
// ============================================================
// main.js – juergennigg.com | Performance-optimiert
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    var grid        = document.getElementById('portfolio-grid');
    var loadMoreBtn = document.getElementById('load-more-btn');
    var filterBtns  = document.querySelectorAll('.filter-btn');
    var lightbox    = document.getElementById('lightbox');

    var activeFilter = 'alle';
    var displayed    = 18;
    var current      = 0;
    var filtered     = [];

    // Escape-Helfer gegen XSS
    function esc(s) {
        var d = document.createElement('div');
        d.textContent = String(s || '');
        return d.innerHTML;
    }

    function getFiltered() {
        return activeFilter === 'alle' || activeFilter === 'all'
            ? portfolioItems
            : portfolioItems.filter(function (i) { return i.cat === activeFilter; });
    }

    // ── Grid rendern ─────────────────────────────────────────
    function render() {
        grid.innerHTML = '';
        filtered = getFiltered();

        var items = filtered.slice(0, displayed);

        // DocumentFragment → ein einziger DOM-Schreibvorgang
        var frag = document.createDocumentFragment();

        items.forEach(function (item, i) {
            var el = document.createElement('div');
            el.className = 'grid-item';
            el.style.gridRowEnd = 'span ' + (item.gridRowSpan || 30);

            // Erste 6 Bilder: eager + hohe Priorität (above the fold)
            // Alle weiteren: lazy + async decode (spart Bandbreite + Main Thread)
            var eager  = i < 6;
            var loading = eager ? 'eager' : 'lazy';
            var prio    = eager ? ' fetchpriority="high"' : '';
            var decode  = ' decoding="' + (eager ? 'sync' : 'async') + '"';

            var objPos = item.pos ? ' style="object-position:' + item.pos + '"' : '';
            el.innerHTML =
                '<img src="' + esc(item.image) + '"'
                + ' alt="' + esc(item.title) + ' – Jürgen Nigg"'
                + ' loading="' + loading + '"'
                + prio + decode + objPos + '>'
                + '<div class="grid-item-overlay">'
                + '<p class="grid-item-sub">'  + esc(item.subtitle) + '</p>'
                + '<h3 class="grid-item-title">' + esc(item.title) + '</h3>'
                + '</div>';

            el.addEventListener('click', (function (idx) {
                return function () { openLightbox(idx); };
            })(i));

            frag.appendChild(el);
        });

        grid.appendChild(frag);
        loadMoreBtn.style.display = filtered.length <= displayed ? 'none' : 'block';
    }

    // ── Filter ───────────────────────────────────────────────
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFilter = btn.dataset.cat;
            displayed    = 18;
            // requestAnimationFrame → Browser-Paint nicht blockieren
            requestAnimationFrame(render);
        });
    });

    // ── Load More ────────────────────────────────────────────
    loadMoreBtn.addEventListener('click', function () {
        displayed += 9;
        requestAnimationFrame(render);
    });

    // ── Lightbox ─────────────────────────────────────────────
    function openLightbox(i) {
        current  = i;
        var item = filtered[i];

        var img  = document.getElementById('lightbox-img');
        img.alt  = esc(item.title) + ' – Jürgen Nigg';
        img.src  = item.image;

        document.getElementById('lightbox-subtitle').textContent = item.subtitle || '';
        document.getElementById('lightbox-title').textContent    = item.title;

        var descEl = document.getElementById('lightbox-description');
        if (item.description) {
            descEl.innerHTML = item.description
                .split('\n')
                .map(function (l) { return l === '' ? '<br>' : esc(l); })
                .join('<br>');
        } else {
            descEl.innerHTML = '';
        }

        var meta  = document.getElementById('lightbox-meta');
        var parts = [];
        if (item.client) parts.push('<span>' + esc(item.client) + '</span>');
        if (item.date)   parts.push('<span>' + esc(item.date) + '</span>');
        meta.innerHTML = parts.join('<span class="meta-sep">&middot;</span>');

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prevItem() { current = (current - 1 + filtered.length) % filtered.length; openLightbox(current); }
    function nextItem() { current = (current + 1) % filtered.length; openLightbox(current); }

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', prevItem);
    document.getElementById('lightbox-next').addEventListener('click', nextItem);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Touch-Swipe für Lightbox (Mobile)
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) { dx < 0 ? nextItem() : prevItem(); }
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  prevItem();
        if (e.key === 'ArrowRight') nextItem();
    });

    // ── Burger Menü ──────────────────────────────────────────
    var burger   = document.getElementById('nav-burger');
    var navLinks = document.getElementById('nav-links');
    if (burger && navLinks) {
        burger.addEventListener('click', function () {
            var open = navLinks.classList.toggle('is-open');
            burger.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        // Menü schließen beim Klick auf einen Link
        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('is-open');
                burger.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        // Menü schließen bei Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
                navLinks.classList.remove('is-open');
                burger.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // ── Smooth scroll ────────────────────────────────────────
    document.querySelectorAll('a[href="#works"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var el = document.getElementById('works');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ── Social Sidebar — nie Footer überlappen ───────────────
    var sidebar = document.querySelector('.social-sidebar');
    var footer  = document.querySelector('.footer');
    if (sidebar && footer) {
        function adjustSidebar() {
            var ft = footer.getBoundingClientRect().top;
            var wh = window.innerHeight;
            sidebar.style.bottom = ft < wh ? (wh - ft + 24) + 'px' : '2rem';
        }
        window.addEventListener('scroll', adjustSidebar, { passive: true });
        window.addEventListener('resize', adjustSidebar, { passive: true });
        adjustSidebar();
    }

    // ── E-Mail — bot-geschützt ───────────────────────────────
    var mailEl = document.getElementById('contact-mail');
    if (mailEl) {
        var a = document.createElement('a');
        a.href = 'mailto:hello@juergennigg.com';
        a.textContent = 'hello@juergennigg.com';
        mailEl.appendChild(a);
    }

    // ── Initial render ───────────────────────────────────────
    render();
});
