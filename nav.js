/* =====================================================
   ADEGA FELLYPE & HWLLY — Navegação Compartilhada
   nav.js — injeta navbar, rodapé, cache e preconnects
   ===================================================== */

/* ── PRECONNECTS (economiza ~200ms de handshake HTTPS) ── */
(function injectPreconnects() {
    const hints = [
        { rel: 'preconnect', href: 'https://script.google.com' },
        { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' },
        { rel: 'dns-prefetch', href: 'https://flagcdn.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    ];
    hints.forEach(({ rel, href }) => {
        if (document.querySelector(`link[href="${href}"]`)) return;
        const l = document.createElement('link');
        l.rel = href; l.rel = rel; l.href = href;
        if (rel === 'preconnect') l.crossOrigin = 'anonymous';
        document.head.prepend(l);
    });
})();

/* ── CACHE API (stale-while-revalidate, TTL 15 min) ── */
(function setupCache() {
    function hashUrl(url) {
        let h = 0;
        for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
        return 'adega_cache_' + Math.abs(h).toString(36);
    }

    /**
     * fetchWithCache(url, ttlMs?)
     * – Retorna dados do localStorage imediatamente se existirem.
     * – Se o cache estiver velho (> ttlMs), faz refresh silencioso em background.
     * – Se não houver cache, faz fetch normal e armazena o resultado.
     */
    window.fetchWithCache = async function (url, ttlMs) {
        ttlMs = ttlMs !== undefined ? ttlMs : 15 * 60 * 1000;
        const key = hashUrl(url);

        let cached = null;
        try { cached = JSON.parse(localStorage.getItem(key)); } catch (e) {}

        const isStale = !cached || (Date.now() - cached.ts > ttlMs);

        if (cached) {
            if (isStale) {
                // Atualiza em background sem bloquear a renderização
                fetch(url)
                    .then(r => r.json())
                    .then(data => {
                        try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch (e) {}
                    })
                    .catch(() => {});
            }
            return cached.data;
        }

        // Sem cache: faz fetch normal e salva
        const res  = await fetch(url);
        const data = await res.json();
        try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch (e) {}
        return data;
    };

    /** Limpa todo o cache da adega (chamar após cadastrar um vinho) */
    window.clearWineCache = function () {
        Object.keys(localStorage)
            .filter(k => k.startsWith('adega_cache_'))
            .forEach(k => localStorage.removeItem(k));
    };
})();

(function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const mainLinks = [
        { href: 'index.html',              label: 'Página Inicial' },
        { href: 'catalogo.html',           label: 'Últimos Vinhos' },
        { href: 'melhores.html',           label: 'Escolhidos Mês' },
        { href: 'games.html',              label: 'Games' },
        { href: 'cadastro.html',           label: 'Cadastrar Novo' },
    ];

    const explorarLinks = [
        { href: 'paises.html',    label: 'Por Países' },
        { href: 'uvas.html',      label: 'Por Uvas' },
        { href: 'vinicolas.html', label: 'Vinícolas' },
        { href: 'stats.html',     label: 'Estatísticas' },
    ];

    const isExplore = explorarLinks.some(l => l.href === currentPage);

    // Verifica se a página é catalogo.html com qualquer parâmetro
    function isActive(href) {
        if (href === 'catalogo.html' && currentPage.startsWith('catalogo')) return true;
        return href === currentPage;
    }

    const navHTML = `
        <nav class="navbar">
            <div class="nav-logo"><a href="index.html">Fellype & Hwlly</a></div>
            <button class="menu-toggle" id="mobile-menu-icon" aria-label="Abrir menu" aria-expanded="false">
                <i class="fas fa-bars" aria-hidden="true"></i>
            </button>
            <ul class="nav-links" id="nav-links-container" role="menubar">
                ${mainLinks.map(l => `
                    <li role="none">
                        <a href="${l.href}" role="menuitem" ${isActive(l.href) ? 'class="active" aria-current="page"' : ''}>${l.label}</a>
                    </li>
                `).join('')}
                <li class="dropdown" role="none">
                    <button class="dropbtn nav-link-style${isExplore ? ' active' : ''}" id="dropdown-trigger" aria-haspopup="true" aria-expanded="false" role="menuitem">
                        Explorar <i class="fa fa-caret-down" aria-hidden="true" style="font-size:0.8rem; margin-left:3px;"></i>
                    </button>
                    <div class="dropdown-content" id="dropdown-content" role="menu">
                        ${explorarLinks.map(l => `
                            <a href="${l.href}" role="menuitem" ${l.href === currentPage ? 'style="color: var(--dourado);"' : ''}>${l.label}</a>
                        `).join('')}
                    </div>
                </li>
            </ul>
        </nav>`;

    const footerHTML = `
        <footer>
            <div class="footer-links">
                <a href="index.html">Início</a>
                <a href="catalogo.html">Catálogo</a>
                <a href="melhores.html">Melhores do Mês</a>
                <a href="paises.html">Por Países</a>
                <a href="uvas.html">Por Uvas</a>
                <a href="vinicolas.html">Vinícolas</a>
                <a href="games.html">Games</a>
                <a href="stats.html">Estatísticas</a>
            </div>
            <hr class="footer-divider">
            Criado com ❤️ para as memórias de Fellype e Hwlly.<br>
            <span id="footer-year"></span> • Guardado por Leblonzito &amp; Ipanemita 🐾
        </footer>
        <button class="back-to-top" id="back-to-top" aria-label="Voltar ao topo">
            <i class="fas fa-chevron-up" aria-hidden="true"></i>
        </button>`;

    /* ---- Injeção ---- */
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        navPlaceholder.outerHTML = navHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = footerHTML;
    } else {
        const existingFooter = document.querySelector('footer');
        if (existingFooter) existingFooter.outerHTML = footerHTML;
        else document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Ano dinâmico no footer
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = 'Ano ' + new Date().getFullYear();

    /* ---- Botão estilo para o dropbtn ---- */
    const style = document.createElement('style');
    style.textContent = `
        .nav-link-style {
            background: none; border: none; cursor: pointer;
            text-decoration: none; color: #ccc; font-size: 0.85rem;
            text-transform: uppercase; transition: all 0.3s ease;
            position: relative; padding-bottom: 5px; padding-top: 0;
            font-family: 'Segoe UI', sans-serif; letter-spacing: 1px;
        }
        .nav-link-style:hover, .nav-link-style.active { color: var(--dourado-claro); }
        .nav-link-style::after {
            content: ''; position: absolute; width: 0; height: 1px;
            bottom: 0; left: 0; background-color: var(--dourado); transition: width 0.3s ease;
        }
        .nav-link-style:hover::after, .nav-link-style.active::after { width: 100%; }
    `;
    document.head.appendChild(style);

    /* ---- Menu Mobile ---- */
    const mobileBtn = document.getElementById('mobile-menu-icon');
    const navLinks  = document.getElementById('nav-links-container');

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('active');
        mobileBtn.setAttribute('aria-expanded', isOpen);
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
    });

    /* ---- Dropdown (click — funciona em mobile e desktop) ---- */
    const dropTrigger = document.getElementById('dropdown-trigger');
    const dropContent = document.getElementById('dropdown-content');

    dropTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropContent.classList.toggle('open');
        dropTrigger.setAttribute('aria-expanded', isOpen);
    });

    /* ---- Fechar ao clicar fora (usa e.target — funciona no mobile) ---- */
    document.addEventListener('click', (e) => {
        // Fecha nav mobile só se o clique foi fora do menu E fora do botão hamburguer
        if (navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
        // Fecha dropdown só se o clique foi fora do trigger E fora do conteúdo
        if (dropContent.classList.contains('open')) {
            if (!dropTrigger.contains(e.target) && !dropContent.contains(e.target)) {
                dropContent.classList.remove('open');
                dropTrigger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    /* ---- Fechar com ESC ---- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navLinks.classList.remove('active');
            dropContent.classList.remove('open');
        }
    });

    /* ---- Back to Top ---- */
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---- Modal de detalhe do vinho (compartilhado) ---- */
    window.WineModal = {
        open(vinho) {
            let backdrop = document.getElementById('wine-modal-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'wine-modal-backdrop';
                backdrop.className = 'wine-modal-backdrop';
                backdrop.innerHTML = `
                    <div class="wine-modal" role="dialog" aria-modal="true" aria-labelledby="modal-wine-name">
                        <button class="wine-modal-close" onclick="WineModal.close()" aria-label="Fechar">
                            <i class="fas fa-times" aria-hidden="true"></i>
                        </button>
                        <img id="modal-img" class="wine-modal-img" src="" alt="">
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

            const IMG_PADRAO = 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop';

            document.getElementById('modal-img').src = vinho.foto || IMG_PADRAO;
            document.getElementById('modal-img').alt = vinho.nome || 'Foto do vinho';
            document.getElementById('modal-wine-name').textContent = vinho.nome || 'Rótulo Especial';
            document.getElementById('modal-produtor').textContent = vinho.produtor || vinho.vinicola || '';

            const campos = [
                { label: 'País', value: vinho.pais },
                { label: 'Região', value: vinho.regiao },
                { label: 'Uva(s)', value: vinho.uva },
                { label: 'Tipo', value: vinho.tipo },
                { label: 'Safra', value: vinho.safra },
                { label: 'Teor Alcoólico', value: vinho.teor },
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

            backdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
        },
        close() {
            const b = document.getElementById('wine-modal-backdrop');
            if (b) b.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') WineModal.close();
    });

})();
