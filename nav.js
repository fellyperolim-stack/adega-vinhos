/* =====================================================
   ADEGA FELLYPE & HWLLY — Navegação compartilhada
   nav.js · marca, navbar, rodapé, cache e modal do vinho
   ===================================================== */

/* ── Imagens padrão do site ─────────────────────────── */
window.IMG_FALLBACK  = 'assets/wine-placeholder.svg';
window.AVATAR_FALLBACK = 'assets/avatar-fallback.svg';

/* ── PRECONNECTS (economiza handshake HTTPS) ────────── */
(function injectPreconnects() {
    const hints = [
        { rel: 'preconnect',   href: 'https://script.google.com' },
        { rel: 'preconnect',   href: 'https://cdnjs.cloudflare.com' },
        { rel: 'preconnect',   href: 'https://fonts.gstatic.com' },
        { rel: 'dns-prefetch', href: 'https://flagcdn.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    ];
    hints.forEach(({ rel, href }) => {
        if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
        const l = document.createElement('link');
        l.rel = rel;
        l.href = href;
        if (rel === 'preconnect') l.crossOrigin = 'anonymous';
        document.head.prepend(l);
    });
})();

/* ── CACHE API (stale-while-revalidate, TTL 15 min) ─── */
(function setupCache() {
    function hashUrl(url) {
        let h = 0;
        for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
        return 'adega_cache_' + Math.abs(h).toString(36);
    }

    window.fetchWithCache = async function (url, ttlMs) {
        ttlMs = ttlMs !== undefined ? ttlMs : 15 * 60 * 1000;
        const key = hashUrl(url);

        let cached = null;
        try { cached = JSON.parse(localStorage.getItem(key)); } catch (e) {}

        const isStale = !cached || (Date.now() - cached.ts > ttlMs);

        if (cached) {
            if (isStale) {
                fetch(url)
                    .then(r => r.json())
                    .then(data => {
                        try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch (e) {}
                    })
                    .catch(() => {});
            }
            return cached.data;
        }

        const res  = await fetch(url);
        const data = await res.json();
        try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch (e) {}
        return data;
    };

    window.clearWineCache = function () {
        Object.keys(localStorage)
            .filter(k => k.startsWith('adega_cache_'))
            .forEach(k => localStorage.removeItem(k));
    };
})();

/* ── Fallback global de imagens quebradas ───────────── */
document.addEventListener('error', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLImageElement) || el.dataset.fbApplied) return;
    el.dataset.fbApplied = '1';
    el.src = el.dataset.fallback || window.IMG_FALLBACK;
}, true);

(function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const mainLinks = [
        { href: 'index.html',    label: 'Início' },
        { href: 'catalogo.html', label: 'Catálogo' },
        { href: 'melhores.html', label: 'Do Mês' },
        { href: 'games.html',    label: 'Games' },
    ];

    const explorarLinks = [
        { href: 'paises.html',    label: 'Por países' },
        { href: 'uvas.html',      label: 'Por uvas' },
        { href: 'vinicolas.html', label: 'Vinícolas' },
        { href: 'stats.html',     label: 'Estatísticas' },
    ];

    const isExplore = explorarLinks.some(l => l.href === currentPage);

    function isActive(href) {
        if (href === 'catalogo.html' && currentPage.startsWith('catalogo')) return true;
        return href === currentPage;
    }

    const navHTML = `
        <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
        <nav class="navbar" aria-label="Navegação principal">
            <div class="nav-logo">
                <a href="index.html" aria-label="Fellype &amp; Hwlly — página inicial">
                    <img src="assets/favicon.svg" class="brand-mark" alt="" width="34" height="34">
                    <span class="brand-text">
                        <span class="brand-name">Fellype &amp; Hwlly</span>
                        <span class="brand-tagline">Adega pessoal</span>
                    </span>
                </a>
            </div>
            <button class="menu-toggle" id="mobile-menu-icon" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-links-container">
                <i class="fas fa-bars" aria-hidden="true"></i>
            </button>
            <ul class="nav-links" id="nav-links-container">
                ${mainLinks.map(l => `
                    <li>
                        <a href="${l.href}" ${isActive(l.href) ? 'class="active" aria-current="page"' : ''}>${l.label}</a>
                    </li>
                `).join('')}
                <li class="dropdown">
                    <button class="dropbtn nav-link-style${isExplore ? ' active' : ''}" id="dropdown-trigger" aria-haspopup="true" aria-expanded="false">
                        Explorar <i class="fa fa-caret-down" aria-hidden="true" style="font-size:0.75rem;"></i>
                    </button>
                    <div class="dropdown-content" id="dropdown-content">
                        ${explorarLinks.map(l => `
                            <a href="${l.href}" ${l.href === currentPage ? 'class="active" aria-current="page"' : ''}>${l.label}</a>
                        `).join('')}
                    </div>
                </li>
                <li>
                    <a href="cadastro.html" class="btn-primario" style="padding:11px 18px; min-height:40px; font-size:0.66rem;">
                        <i class="fas fa-plus" aria-hidden="true"></i> Registrar
                    </a>
                </li>
            </ul>
        </nav>`;

    const footerHTML = `
        <footer>
            <div class="footer-brand">Fellype &amp; Hwlly</div>
            <div class="footer-links">
                <a href="index.html">Início</a>
                <a href="catalogo.html">Catálogo</a>
                <a href="melhores.html">Melhores do mês</a>
                <a href="paises.html">Por países</a>
                <a href="uvas.html">Por uvas</a>
                <a href="vinicolas.html">Vinícolas</a>
                <a href="stats.html">Estatísticas</a>
                <a href="games.html">Games</a>
            </div>
            <hr class="footer-divider">
            <div class="footer-nota">
                Feito com ❤️ para as nossas memórias.<br>
                <span id="footer-year"></span> · Curadoria de Leblonzito &amp; Ipanemita
            </div>
        </footer>
        <button class="back-to-top" id="back-to-top" aria-label="Voltar ao topo">
            <i class="fas fa-chevron-up" aria-hidden="true"></i>
        </button>`;

    /* ---- Injeção ---- */
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) navPlaceholder.outerHTML = navHTML;
    else document.body.insertAdjacentHTML('afterbegin', navHTML);

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = footerHTML;
    } else {
        const existingFooter = document.querySelector('footer');
        if (existingFooter) existingFooter.outerHTML = footerHTML;
        else document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    /* ---- Alvo do "ir para o conteúdo" ---- */
    (function ancoraConteudo() {
        const skip = document.querySelector('.skip-link');
        const alvo = document.querySelector('main, .hero, .header-section, .search-section, .stats-header');
        if (!skip || !alvo) return;
        if (!alvo.id) alvo.id = 'conteudo';
        skip.setAttribute('href', '#' + alvo.id);
        alvo.setAttribute('tabindex', '-1');
    })();

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- Menu mobile ---- */
    const mobileBtn = document.getElementById('mobile-menu-icon');
    const navLinks  = document.getElementById('nav-links-container');

    function closeMenu() {
        navLinks.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('active');
        mobileBtn.setAttribute('aria-expanded', isOpen);
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
    });

    /* ---- Dropdown ---- */
    const dropTrigger = document.getElementById('dropdown-trigger');
    const dropContent = document.getElementById('dropdown-content');

    dropTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropContent.classList.toggle('open');
        dropTrigger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) closeMenu();

        if (dropContent.classList.contains('open') &&
            !dropTrigger.contains(e.target) && !dropContent.contains(e.target)) {
            dropContent.classList.remove('open');
            dropTrigger.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        closeMenu();
        dropContent.classList.remove('open');
        dropTrigger.setAttribute('aria-expanded', 'false');
    });

    /* ---- Back to top ---- */
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---- Modal de detalhe do vinho ---- */
    let ultimoFoco = null;

    window.WineModal = {
        open(vinho) {
            let backdrop = document.getElementById('wine-modal-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'wine-modal-backdrop';
                backdrop.className = 'wine-modal-backdrop';
                backdrop.innerHTML = `
                    <div class="wine-modal" role="dialog" aria-modal="true" aria-labelledby="modal-wine-name">
                        <button class="wine-modal-close" onclick="WineModal.close()" aria-label="Fechar detalhes">
                            <i class="fas fa-times" aria-hidden="true"></i>
                        </button>
                        <img id="modal-img" class="wine-modal-img" src="" alt="" data-fallback="${window.IMG_FALLBACK}">
                        <div class="wine-modal-body">
                            <h2 class="wine-modal-name" id="modal-wine-name"></h2>
                            <p class="wine-modal-produtor" id="modal-produtor"></p>
                            <div class="wine-modal-grid" id="modal-grid"></div>
                            <div class="wine-modal-notas" id="modal-notas"></div>
                        </div>
                    </div>`;
                document.body.appendChild(backdrop);
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) WineModal.close();
                });
            }

            const img = document.getElementById('modal-img');
            img.dataset.fbApplied = '';
            img.src = vinho.foto || window.IMG_FALLBACK;
            img.alt = vinho.nome ? 'Rótulo: ' + vinho.nome : 'Foto do vinho';

            document.getElementById('modal-wine-name').textContent = vinho.nome || 'Rótulo especial';
            document.getElementById('modal-produtor').textContent = vinho.produtor || vinho.vinicola || '';

            const campos = [
                { label: 'País', value: vinho.pais },
                { label: 'Região', value: vinho.regiao },
                { label: 'Uva(s)', value: vinho.uva },
                { label: 'Tipo', value: vinho.tipo },
                { label: 'Safra', value: vinho.safra },
                { label: 'Teor alcoólico', value: vinho.teor },
                { label: 'Classificação', value: vinho.classificacao },
                { label: 'Degustado em', value: vinho.data },
            ].filter(c => c.value && c.value !== 'N/A' && c.value !== '-');

            document.getElementById('modal-grid').innerHTML = campos.map(c => `
                <div class="wine-modal-field">
                    <div class="wine-modal-field-label">${c.label}</div>
                    <div class="wine-modal-field-value">${c.value}</div>
                </div>`).join('');

            const notaF = vinho.notaF || vinho['Pontuação Fellype'];
            const notaH = vinho.notaH || vinho['Pontuação Hwlly'];
            document.getElementById('modal-notas').innerHTML = `
                <div class="wine-modal-nota-box">
                    <div class="wine-modal-nota-label">Fellype</div>
                    <div class="wine-modal-nota-valor">${notaF || '—'}</div>
                </div>
                <div class="wine-modal-nota-box">
                    <div class="wine-modal-nota-label">Hwlly</div>
                    <div class="wine-modal-nota-valor">${notaH || '—'}</div>
                </div>`;

            ultimoFoco = document.activeElement;
            backdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
            backdrop.querySelector('.wine-modal-close').focus({ preventScroll: true });
        },
        close() {
            const b = document.getElementById('wine-modal-backdrop');
            if (b) b.classList.remove('open');
            document.body.style.overflow = '';
            if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') WineModal.close();
    });
})();
