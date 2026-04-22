// ============================================================
// WALLPAPERS.JS – juergennigg.com
// Download-Zählung via localStorage (clientseitig)
// Für serverseitige Zählung: fetch() an eigenen Endpoint
// ============================================================

const WP_BASE = 'assets/img/wallpapers/';
const WP_STORAGE_KEY = 'jn_wp_downloads';

// ── Download-Zähler ─────────────────────────────────────────

function loadCounts() {
    try {
        return JSON.parse(localStorage.getItem(WP_STORAGE_KEY)) || {};
    } catch { return {}; }
}

function saveCounts(counts) {
    try { localStorage.setItem(WP_STORAGE_KEY, JSON.stringify(counts)); } catch {}
}

function incrementCount(id) {
    const counts = loadCounts();
    counts[id] = (counts[id] || 0) + 1;
    saveCounts(counts);
    return counts[id];
}

function getCount(id) {
    return loadCounts()[id] || 0;
}

function getTotalDownloads() {
    const counts = loadCounts();
    return Object.values(counts).reduce((a, b) => a + b, 0);
}

// ── Format-Label ─────────────────────────────────────────────

function formatLabel(wp) {
    const icons = { landscape: '⬛', portrait: '▮', panorama: '▬' };
    return `${icons[wp.format] || ''} ${wp.resolution} · ${wp.dimensions}`;
}

function formatBadgeClass(res) {
    if (res === '8K') return 'badge-8k';
    if (res === '4K') return 'badge-4k';
    return 'badge-2k';
}

// ── Grid rendern ─────────────────────────────────────────────

function renderGrid(filter) {
    const grid = document.getElementById('wp-grid');
    grid.innerHTML = '';

    const items = filter === 'all'
        ? wallpapers
        : wallpapers.filter(w => w.format === filter);

    if (items.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-gray);grid-column:1/-1;text-align:center;padding:3rem 0">Keine Wallpapers in diesem Format.</p>';
        return;
    }

    // Grid-Klasse je nach Tab
    grid.className = 'wp-grid ' + (filter === 'portrait' ? 'portrait-format' : 'landscape-format');

    items.forEach(wp => {
        const count = getCount(wp.id);
        const card = document.createElement('div');
        card.className = 'wp-card';
        card.dataset.id = wp.id;

        card.innerHTML = `
            <img src="${WP_BASE}${wp.file}" alt="${wp.title}" loading="lazy">
            <div class="wp-card-overlay">
                <div class="wp-card-meta">
                    <span class="wp-res-badge ${formatBadgeClass(wp.resolution)}">${wp.resolution}</span>
                    <span class="wp-dl-count" id="count-${wp.id}">
                        <i class="fas fa-download"></i> ${count}
                    </span>
                </div>
                <p class="wp-card-title">${wp.title}</p>
                <span class="wp-card-dl">
                    <i class="fas fa-expand"></i> Ansehen & Download
                </span>
            </div>
        `;

        card.addEventListener('click', () => openOverlay(wp));
        grid.appendChild(card);
    });

    // Gesamtanzahl updaten
    updateTotalCounter();
}

// ── Overlay ───────────────────────────────────────────────────

function openOverlay(wp) {
    const overlay    = document.getElementById('wp-overlay');
    const img        = document.getElementById('wp-overlay-img');
    const title      = document.getElementById('wp-overlay-title');
    const subtitle   = document.getElementById('wp-overlay-subtitle');
    const quality    = document.getElementById('wp-overlay-quality');
    const dlBtn      = document.getElementById('wp-dl-btn');

    img.src         = WP_BASE + wp.file;
    img.alt         = wp.title;
    title.textContent   = wp.title;
    subtitle.textContent = wp.subtitle || '';
    quality.textContent  = `${wp.resolution}  ·  ${wp.dimensions}  ·  ${wp.format.charAt(0).toUpperCase() + wp.format.slice(1)}`;

    // Download Button
    dlBtn.href     = WP_BASE + wp.file;
    dlBtn.download = wp.file;

    // Klick-Handler für Zählung
    dlBtn.onclick = () => {
        const newCount = incrementCount(wp.id);
        // Update Karte im Grid
        const countEl = document.getElementById(`count-${wp.id}`);
        if (countEl) countEl.innerHTML = `<i class="fas fa-download"></i> ${newCount}`;
        updateTotalCounter();
        // Overlay offen lassen, Browser startet Download
    };

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOverlay() {
    document.getElementById('wp-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('wp-overlay-img').src = '';
}

// ── Gesamt-Counter ────────────────────────────────────────────

function updateTotalCounter() {
    const el = document.getElementById('total-downloads');
    if (el) el.textContent = getTotalDownloads().toLocaleString('de-AT');
}

// ── Format-Tabs ───────────────────────────────────────────────

function initTabs() {
    const tabs = document.querySelectorAll('.wp-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderGrid(tab.dataset.format);
        });
    });
}

// ── Lead-Form ─────────────────────────────────────────────────

function initLeadForm() {
    const form    = document.getElementById('wp-lead-form');
    const success = document.getElementById('wp-lead-success');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('wp-email').value;

        // Mailchimp / ConvertKit Endpoint hier eintragen:
        // fetch('https://...', { method: 'POST', body: ... })

        console.log('Newsletter signup:', email);
        form.closest('.wp-lead-inner').style.display = 'none';
        success.classList.add('visible');
    });
}

// ── Init ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // Overlay Events
    document.getElementById('wp-overlay-close')
        .addEventListener('click', closeOverlay);

    document.getElementById('wp-overlay')
        .addEventListener('click', (e) => {
            if (e.target === document.getElementById('wp-overlay')) closeOverlay();
        });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeOverlay();
    });

    // Smooth scroll CTA
    document.querySelectorAll('a[href="#wallpapers"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('wallpapers')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    initTabs();
    initLeadForm();
    renderGrid('all');
});
