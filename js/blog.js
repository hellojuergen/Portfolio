'use strict';
// blog.js – Journal + Filme. Einträge erscheinen ab ihrem Datum.
// Geplante Einträge bleiben unsichtbar, bis ihr Datum erreicht ist.

document.addEventListener('DOMContentLoaded', function () {

    function esc(s) { var d = document.createElement('div'); d.textContent = String(s || ''); return d.innerHTML; }
    function fmt(iso) {
        var m = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
        var p = iso.split('-'); return parseInt(p[2], 10) + '. ' + m[parseInt(p[1], 10) - 1] + ' ' + p[0];
    }
    function card(label, c, foot) {
        var chips = (c.chips || []).map(function (x) { return '<span class="bl-chip">' + esc(x) + '</span>'; }).join('');
        return '<div class="bl-card"><div class="bl-card-label">' + esc(label) + '</div>' +
               '<h3>' + esc(c.head) + '</h3><p>' + esc(c.body) + '</p>' +
               (chips ? '<div class="bl-chips">' + chips + '</div>' : '') +
               '<div class="bl-card-foot">' + esc(foot) + '</div></div>';
    }

    var preview = false;
    var today = new Date(); today.setHours(23, 59, 59, 0);

    var items = (window.journal || []).filter(function (e) {
        return preview || new Date(e.date + 'T00:00:00') <= today;
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });

    var list = document.getElementById('bl-list');
    var html = items.map(function (e) {
        var planned = new Date(e.date + 'T00:00:00') > today;
        var out = '<article class="bl-entry" id="' + esc(e.date + '-' + e.slug) + '">' +
            '<img class="bl-img" src="' + esc(e.img) + '" alt="' + esc(e.alt) + '" loading="lazy">' +
            '<div><div class="bl-meta"><span>' + fmt(e.date) + '</span>' +
            (planned ? '<span class="bl-planned">geplant</span>' : '') + '</div>' +
            '<h2 class="bl-title">' + esc(e.title) + '</h2>' +
            (e.text || []).map(function (t) { return '<p class="bl-text">' + esc(t) + '</p>'; }).join('');
        if (e.fieldNote) out += card('Field Note ' + String(e.fieldNote.no).padStart(2, '0') + ' · ' + e.fieldNote.cat, e.fieldNote, 'Save it for your next session.');
        if (e.hindsight) out += card('Hindsight ' + String(e.hindsight.no).padStart(2, '0') + ' · What I’d do differently', e.hindsight, 'From the archive, with notes.');
        out += '<a class="bl-ig" href="https://www.instagram.com/juergennigg/" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i> Auf Instagram</a></div></article>';
        return out;
    }).join('');
    list.innerHTML = html;
    document.getElementById('bl-empty').hidden = items.length > 0;

    var films = document.getElementById('bl-films');
    films.innerHTML = (window.films || []).map(function (f) {
        return '<div class="bl-film"><div class="bl-film-frame">' +
            '<iframe src="https://player.vimeo.com/video/' + esc(f.id) + '?dnt=1&title=0&byline=0&portrait=0" loading="lazy" ' +
            'allow="fullscreen; picture-in-picture" allowfullscreen title="' + esc(f.title) + '"></iframe></div>' +
            '<h3>' + esc(f.title) + '</h3><p>' + f.year + ' · ' + esc(f.dur) + '<br>' + esc(f.note) + '</p></div>';
    }).join('');

    // Burger-Menü (wie main.js)
    var burger = document.getElementById('nav-burger'), nav = document.getElementById('nav-links');
    if (burger && nav) burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });
});
