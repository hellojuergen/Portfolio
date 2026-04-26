var WP_PATH = 'assets/img/wallpapers/';
var STORE   = 'jn_wp_dl';

function getCounts(){ try{ return JSON.parse(localStorage.getItem(STORE))||{}; }catch(e){ return {}; } }
function saveCounts(c){ try{ localStorage.setItem(STORE,JSON.stringify(c)); }catch(e){} }
function addCount(id){ var c=getCounts(); c[id]=(c[id]||0)+1; saveCounts(c); return c[id]; }
function getCount(id){ return getCounts()[id]||0; }
function totalDl(){ var c=getCounts(); return Object.values(c).reduce(function(a,b){return a+b;},0); }

function updateTotal(){
    var el=document.getElementById('total-downloads');
    if(el) el.textContent=totalDl();
}

function renderGrid(filter){
    var grid=document.getElementById('wp-grid');
    grid.innerHTML='';
    var items=filter==='all' ? wallpapers : wallpapers.filter(function(w){ return w.format===filter; });

    // Grid-Klasse für Portrait-Filter
    grid.className='wp-grid'+(filter==='portrait' ? ' portrait-format' : '');

    items.forEach(function(wp){
        var cnt=getCount(wp.id);
        var card=document.createElement('div');
        card.className='wp-card is-'+wp.format;

        card.innerHTML=
            '<img src="'+WP_PATH+wp.file+'" alt="'+wp.title+'" loading="lazy">'+
            '<div class="wp-card-overlay">'+
                '<div class="wp-card-meta">'+
                    '<span class="wp-badge-res badge-'+wp.resolution.toLowerCase()+'">'+wp.resolution+'</span>'+
                    '<span class="wp-dl-count" id="cnt-'+wp.id+'"><i class="fas fa-download"></i> '+cnt+'</span>'+
                '</div>'+
                '<p class="wp-card-title">'+wp.title+'</p>'+
                '<span class="wp-card-dl"><i class="fas fa-expand"></i> Ansehen</span>'+
            '</div>';

        card.addEventListener('click', function(){ openOverlay(wp); });
        grid.appendChild(card);
    });
    updateTotal();
}

function openOverlay(wp){
    document.getElementById('wp-overlay-img').src=WP_PATH+wp.file;
    document.getElementById('wp-overlay-img').alt=wp.title;
    document.getElementById('wp-overlay-title').textContent=wp.title;
    document.getElementById('wp-overlay-subtitle').textContent=wp.subtitle;
    document.getElementById('wp-overlay-quality').textContent=
        wp.resolution+'  ·  '+wp.dimensions+'  ·  '+wp.format.charAt(0).toUpperCase()+wp.format.slice(1);

    var btn=document.getElementById('wp-dl-btn');
    btn.href=WP_PATH+wp.file;
    btn.download=wp.file;
    btn.onclick=function(){
        var n=addCount(wp.id);
        var el=document.getElementById('cnt-'+wp.id);
        if(el) el.innerHTML='<i class="fas fa-download"></i> '+n;
        updateTotal();
    };

    document.getElementById('wp-overlay').classList.add('active');
    document.body.style.overflow='hidden';
}

function closeOverlay(){
    document.getElementById('wp-overlay').classList.remove('active');
    document.body.style.overflow='auto';
    document.getElementById('wp-overlay-img').src='';
}

document.addEventListener('DOMContentLoaded',function(){
    document.getElementById('wp-overlay-close').addEventListener('click',closeOverlay);
    document.getElementById('wp-overlay').addEventListener('click',function(e){
        if(e.target===this) closeOverlay();
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeOverlay(); });

    document.querySelectorAll('.wp-tab').forEach(function(tab){
        tab.addEventListener('click',function(){
            document.querySelectorAll('.wp-tab').forEach(function(t){ t.classList.remove('active'); });
            tab.classList.add('active');
            renderGrid(tab.dataset.format);
        });
    });

    document.querySelectorAll('a[href="#wallpapers"]').forEach(function(a){
        a.addEventListener('click',function(e){
            e.preventDefault();
            document.getElementById('wallpapers').scrollIntoView({behavior:'smooth'});
        });
    });

    renderGrid('all');
});
