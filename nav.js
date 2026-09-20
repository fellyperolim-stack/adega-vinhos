/* =====================================================
   ADEGA FELLYPE & HWLLY — Navegação compartilhada
   nav.js · marca, navbar, rodapé, cache e modal do vinho
   ===================================================== */

/* ── Imagens padrão do site ─────────────────────────── */
window.IMG_FALLBACK  = 'assets/wine-placeholder.svg';
window.AVATAR_FALLBACK = 'assets/avatar-fallback.svg';

/* ── Recarrega sozinho quando um service worker novo assume ── */
(function autoReloadOnSwUpdate() {
    if (!('serviceWorker' in navigator)) return;
    let jaRecarregou = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (jaRecarregou) return;
        jaRecarregou = true;
        window.location.reload();
    });
})();

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
    const T = window.I18N ? window.I18N.t : (k) => k;

    const mainLinks = [
        { href: 'index.html',    key: 'nav.home' },
        { href: 'catalogo.html', key: 'nav.catalog' },
        { href: 'blog.html',     key: 'nav.blog' },
        { href: 'melhores.html', key: 'nav.best' },
        { href: 'games.html',    key: 'nav.games' },
    ];

    const explorarLinks = [
        { href: 'paises.html',    key: 'nav.countries' },
        { href: 'uvas.html',      key: 'nav.grapes' },
        { href: 'vinicolas.html', key: 'nav.wineries' },
        { href: 'stats.html',     key: 'nav.stats' },
    ];

    const isExplore = explorarLinks.some(l => l.href === currentPage);

    function isActive(href) {
        if (href === 'catalogo.html' && currentPage.startsWith('catalogo')) return true;
        return href === currentPage;
    }

    const langSwitcherHTML = window.I18N ? window.I18N.buildSwitcherHTML() : '';

    const navHTML = `
        <a class="skip-link" href="#conteudo" data-i18n="nav.skip">${T('nav.skip')}</a>
        <nav class="navbar" data-i18n-aria-label="common.main_nav_aria" aria-label="${T('common.main_nav_aria')}">
            <div class="nav-logo">
                <a href="index.html" data-i18n-aria-label="nav.home_aria" aria-label="${T('nav.home_aria')}">
                    <img src="assets/favicon.svg" class="brand-mark" alt="" width="34" height="34">
                    <span class="brand-text">
                        <span class="brand-name">Fellype &amp; Hwlly</span>
                        <span class="brand-tagline" data-i18n="nav.tagline">${T('nav.tagline')}</span>
                    </span>
                </a>
            </div>
            <button class="menu-toggle" id="mobile-menu-icon" data-i18n-aria-label="nav.open_menu" aria-label="${T('nav.open_menu')}" aria-expanded="false" aria-controls="nav-links-container">
                <i class="fas fa-bars" aria-hidden="true"></i>
            </button>
            <ul class="nav-links" id="nav-links-container">
                ${mainLinks.map(l => `
                    <li>
                        <a href="${l.href}" data-i18n="${l.key}" ${isActive(l.href) ? 'class="active" aria-current="page"' : ''}>${T(l.key)}</a>
                    </li>
                `).join('')}
                <li class="dropdown">
                    <button class="dropbtn nav-link-style${isExplore ? ' active' : ''}" id="dropdown-trigger" aria-haspopup="true" aria-expanded="false">
                        <span data-i18n="nav.explore">${T('nav.explore')}</span> <i class="fa fa-caret-down" aria-hidden="true" style="font-size:0.75rem;"></i>
                    </button>
                    <div class="dropdown-content" id="dropdown-content">
                        ${explorarLinks.map(l => `
                            <a href="${l.href}" data-i18n="${l.key}" ${l.href === currentPage ? 'class="active" aria-current="page"' : ''}>${T(l.key)}</a>
                        `).join('')}
                    </div>
                </li>
                <li>
                    <a href="cadastro.html" class="btn-primario" style="padding:11px 18px; min-height:40px; font-size:0.66rem;">
                        <i class="fas fa-plus" aria-hidden="true"></i> <span data-i18n="nav.register">${T('nav.register')}</span>
                    </a>
                </li>
                ${langSwitcherHTML}
            </ul>
        </nav>`;

    const footerHTML = `
        <footer>
            <div class="footer-brand">Fellype &amp; Hwlly</div>
            <div class="footer-links">
                <a href="index.html" data-i18n="nav.home">${T('nav.home')}</a>
                <a href="catalogo.html" data-i18n="nav.catalog">${T('nav.catalog')}</a>
                <a href="melhores.html" data-i18n="nav.best">${T('nav.best')}</a>
                <a href="paises.html" data-i18n="nav.countries">${T('nav.countries')}</a>
                <a href="uvas.html" data-i18n="nav.grapes">${T('nav.grapes')}</a>
                <a href="vinicolas.html" data-i18n="nav.wineries">${T('nav.wineries')}</a>
                <a href="stats.html" data-i18n="nav.stats">${T('nav.stats')}</a>
                <a href="games.html" data-i18n="nav.games">${T('nav.games')}</a>
                <a href="blog.html" data-i18n="nav.blog">${T('nav.blog')}</a>
            </div>
            <hr class="footer-divider">
            <div class="footer-nota">
                <span data-i18n="footer.tagline">${T('footer.tagline')}</span><br>
                <span id="footer-year"></span> · <span data-i18n="footer.curation">${T('footer.curation')}</span>
            </div>
        </footer>
        <button class="back-to-top" id="back-to-top" data-i18n-aria-label="common.back_to_top" aria-label="${T('common.back_to_top')}">
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

    /* ---- Seletor de idioma ---- */
    if (window.I18N) {
        window.I18N.wireSwitcher(document);
        window.addEventListener('i18n:change', () => window.I18N.applyStaticI18n());
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
    let vinhoAtual = null;
    let imagemAtualFile = null;
    const Tm = (k) => (window.I18N ? window.I18N.t(k) : k);
    const trPais = (v) => (window.I18N ? window.I18N.translateCountry(v) : v);
    const trTipo = (v) => (window.I18N ? window.I18N.translateTipo(v) : v);
    const trClass = (v) => (window.I18N ? window.I18N.translateClassificacao(v) : v);

    /* ---- Geração do cartão de compartilhamento (canvas) ---- */
    function loadImageFromBlob(blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
            img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
            img.src = url;
        });
    }

    function getFlagUrl(pais) {
        if (!pais) return 'https://flagcdn.com/w80/un.png';
        const n = pais.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
        const flags = {
            'franca': 'fr', 'italia': 'it', 'espanha': 'es', 'portugal': 'pt', 'chile': 'cl',
            'argentina': 'ar', 'estados unidos': 'us', 'eua': 'us', 'brasil': 'br', 'alemanha': 'de',
            'austria': 'at', 'australia': 'au', 'nova zelandia': 'nz', 'africa do sul': 'za',
            'uruguai': 'uy', 'hungria': 'hu', 'grecia': 'gr', 'georgia': 'ge', 'suica': 'ch',
            'israel': 'il', 'libano': 'lb', 'romenia': 'ro', 'bulgaria': 'bg', 'croacia': 'hr',
            'eslovenia': 'si', 'moldavia': 'md', 'canada': 'ca', 'inglaterra': 'gb', 'reino unido': 'gb',
            'japao': 'jp', 'china': 'cn'
        };
        return `https://flagcdn.com/w80/${flags[n] || 'un'}.png`;
    }

    function drawCover(ctx, img, x, y, w, h) {
        const imgRatio = img.width / img.height;
        const boxRatio = w / h;
        let sx, sy, sw, sh;
        if (imgRatio > boxRatio) {
            sh = img.height; sw = sh * boxRatio; sx = (img.width - sw) / 2; sy = 0;
        } else {
            sw = img.width; sh = sw / boxRatio; sx = 0; sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    }

    function fitText(ctx, text, maxWidth) {
        if (ctx.measureText(text).width <= maxWidth) return text;
        let t = text;
        while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
        return t + '…';
    }

    function wrapLines(ctx, text, maxWidth, maxLines) {
        const words = text.split(/\s+/).filter(Boolean);
        const lines = [];
        let current = '';
        let idx = 0;
        while (idx < words.length && lines.length < maxLines) {
            const word = words[idx];
            const test = current ? `${current} ${word}` : word;
            if (ctx.measureText(test).width <= maxWidth || !current) {
                current = test;
                idx++;
            } else {
                lines.push(current);
                current = '';
            }
        }
        if (current) lines.push(current);
        if (lines.length > maxLines) lines.length = maxLines;
        if (idx < words.length && lines.length) {
            lines[lines.length - 1] = fitText(ctx, lines[lines.length - 1] + '…', maxWidth);
        }
        return lines;
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function setLetterSpacing(ctx, px) {
        try { ctx.letterSpacing = px + 'px'; } catch (e) {}
    }

    function drawOrnamentLine(ctx, cy, W, PAD) {
        const midGap = 26;
        ctx.strokeStyle = 'rgba(198,161,91,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(PAD, cy);
        ctx.lineTo(W / 2 - midGap, cy);
        ctx.moveTo(W / 2 + midGap, cy);
        ctx.lineTo(W - PAD, cy);
        ctx.stroke();

        ctx.fillStyle = '#C6A15B';
        ctx.font = '22px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('◆', W / 2, cy + 7);
        ctx.textAlign = 'left';
    }

    async function buildShareCard(vinho, fotoBlob, flagBlob) {
        const W = 1080, H = 1920, PAD = 56, PHOTO_H = 720, FRAME = 22;
        const canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#15100F';
        ctx.fillRect(0, 0, W, H);

        let flagImg = null;
        if (flagBlob) {
            try { flagImg = await loadImageFromBlob(flagBlob); } catch (e) {}
        }

        if (fotoBlob) {
            try {
                const img = await loadImageFromBlob(fotoBlob);
                drawCover(ctx, img, 0, 0, W, PHOTO_H);
            } catch (e) {
                ctx.fillStyle = '#1C1413';
                ctx.fillRect(0, 0, W, PHOTO_H);
            }
        } else {
            ctx.fillStyle = '#1C1413';
            ctx.fillRect(0, 0, W, PHOTO_H);
        }

        // selo de nota estilo carimbo, sobre a foto (fora da zona que o Instagram cobre no topo)
        const notaF = parseFloat(String(vinho.notaF).replace(',', '.')) || null;
        const notaH = parseFloat(String(vinho.notaH).replace(',', '.')) || null;
        let notaMedia = null;
        if (notaF && notaH) notaMedia = ((notaF + notaH) / 2).toFixed(1);
        else if (notaF) notaMedia = notaF.toFixed(1);
        else if (notaH) notaMedia = notaH.toFixed(1);

        if (notaMedia) {
            const bx = W - 148, by = 346, r = 86;
            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(-8 * Math.PI / 180);

            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(10,7,7,0.55)';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(198,161,91,0.85)';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, r - 10, 0, Math.PI * 2);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(198,161,91,0.5)';
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = '#C6A15B';
            ctx.font = '18px Georgia, serif';
            ctx.fillText('★ ★ ★ ★ ★', 0, -18);

            ctx.fillStyle = '#F1E2B8';
            ctx.font = "600 46px Cinzel, Georgia, serif";
            ctx.fillText(notaMedia, 0, 30);

            ctx.fillStyle = '#DDB975';
            ctx.font = "600 13px 'Outfit', Arial, sans-serif";
            setLetterSpacing(ctx, 2);
            ctx.fillText('NOTA MÉDIA', 0, 52);
            setLetterSpacing(ctx, 0);

            ctx.restore();
            ctx.textAlign = 'left';
        }

        // transição foto → painel (topo fica limpo: zona coberta pelo cabeçalho do Instagram nos Stories)
        const grad = ctx.createLinearGradient(0, PHOTO_H - 280, 0, PHOTO_H);
        grad.addColorStop(0, 'rgba(21,16,15,0)');
        grad.addColorStop(1, 'rgba(21,16,15,1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, PHOTO_H - 280, W, 280);

        ctx.fillStyle = '#15100F';
        ctx.fillRect(0, PHOTO_H, W, H - PHOTO_H);

        if (document.fonts && document.fonts.ready) {
            try { await document.fonts.ready; } catch (e) {}
        }
        try { await document.fonts.load("900 22px 'Font Awesome 6 Free'"); } catch (e) {}

        ctx.textAlign = 'left';
        let cy = PHOTO_H + 78;

        // numeração da coleção (toque pessoal, quando disponível)
        if (vinho.numero) {
            ctx.fillStyle = 'rgba(221,185,117,0.85)';
            ctx.font = "600 20px 'Outfit', Arial, sans-serif";
            setLetterSpacing(ctx, 3);
            ctx.fillText(`DEGUSTAÇÃO Nº ${vinho.numero}`, PAD, cy - 24);
            setLetterSpacing(ctx, 0);
            cy += 26;
        }

        // selo do tipo de vinho
        if (vinho.tipo && vinho.tipo !== '-') {
            const tipoTxt = (trTipo(vinho.tipo) || vinho.tipo).toUpperCase();
            ctx.font = "600 22px 'Outfit', Arial, sans-serif";
            setLetterSpacing(ctx, 3);
            const tw = ctx.measureText(tipoTxt).width;
            const pillW = tw + 56, pillH = 46;
            ctx.fillStyle = 'rgba(198,161,91,0.12)';
            ctx.strokeStyle = 'rgba(198,161,91,0.5)';
            ctx.lineWidth = 2;
            roundRect(ctx, PAD, cy - 32, pillW, pillH, pillH / 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#E4CB94';
            ctx.textAlign = 'center';
            ctx.fillText(tipoTxt, PAD + pillW / 2, cy - 1);
            ctx.textAlign = 'left';
            setLetterSpacing(ctx, 0);
            cy += 70;
        }

        // nome do vinho (até 2 linhas)
        ctx.fillStyle = '#E4CB94';
        ctx.font = "600 50px Cinzel, Georgia, serif";
        const nomeLinhas = wrapLines(ctx, (vinho.nome || 'Vinho Especial').toUpperCase(), W - PAD * 2, 2);
        nomeLinhas.forEach((linha, i) => ctx.fillText(linha, PAD, cy + i * 56));
        cy += (nomeLinhas.length - 1) * 56 + 46;

        if (vinho.produtor) {
            ctx.fillStyle = '#A0938C';
            ctx.font = "400 28px 'Outfit', Arial, sans-serif";
            ctx.fillText(fitText(ctx, vinho.produtor, W - PAD * 2), PAD, cy);
            cy += 46;
        } else {
            cy += 10;
        }

        cy += 22;
        drawOrnamentLine(ctx, cy, W, PAD);
        cy += 38;

        // grade de campos (mesmos rótulos da modal do site)
        const campos = [
            { label: 'PAÍS', value: trPais(vinho.pais), flag: true },
            { label: 'REGIÃO', value: vinho.regiao, icon: '' },
            { label: 'UVA(S)', value: vinho.uva, icon: '' },
            { label: 'SAFRA', value: vinho.safra, icon: '' },
            { label: 'TEOR ALCOÓLICO', value: vinho.teor, icon: '' },
            { label: 'CLASSIFICAÇÃO', value: trClass(vinho.classificacao), icon: '' },
            { label: 'DEGUSTADO EM', value: vinho.data, icon: '' },
        ].filter(c => c.value && c.value !== 'N/A' && c.value !== '-');

        if (campos.length) {
            const fGap = 14;
            const fW = (W - PAD * 2 - fGap) / 2;
            const fH = 92;
            campos.forEach((c, i) => {
                const col = i % 2, row = Math.floor(i / 2);
                const bx = PAD + col * (fW + fGap);
                const by = cy + row * (fH + fGap);

                ctx.fillStyle = 'rgba(255,255,255,0.03)';
                ctx.strokeStyle = 'rgba(255,255,255,0.10)';
                ctx.lineWidth = 2;
                roundRect(ctx, bx, by, fW, fH, 14);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#C6A15B';
                ctx.font = "600 16px 'Outfit', Arial, sans-serif";
                setLetterSpacing(ctx, 2);
                ctx.fillText(fitText(ctx, c.label, fW - 34), bx + 20, by + 32);
                setLetterSpacing(ctx, 0);

                let valueX = bx + 20;
                if (c.flag && flagImg) {
                    const flagW = 30, flagH = 20, flagX = bx + 20, flagY = by + 47;
                    ctx.drawImage(flagImg, flagX, flagY, flagW, flagH);
                    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(flagX, flagY, flagW, flagH);
                    valueX = flagX + flagW + 12;
                } else if (c.icon) {
                    ctx.fillStyle = '#DDB975';
                    ctx.font = "900 22px 'Font Awesome 6 Free'";
                    ctx.fillText(c.icon, bx + 20, by + 63);
                    valueX = bx + 20 + 32;
                }

                ctx.fillStyle = '#ECE4DD';
                ctx.font = "500 25px 'Outfit', Arial, sans-serif";
                ctx.fillText(fitText(ctx, String(c.value), fW - (valueX - bx) - 14), valueX, by + 65);
            });
            const rows = Math.ceil(campos.length / 2);
            cy += rows * fH + (rows - 1) * fGap + 34;
        } else {
            cy += 14;
        }

        // notas
        const boxGap = 28;
        const boxW = (W - PAD * 2 - boxGap) / 2;
        const boxH = 134;
        const boxes = [
            { label: 'FELLYPE', valor: vinho.notaF || '—' },
            { label: 'HWLLY', valor: vinho.notaH || '—' },
        ];
        ctx.textAlign = 'center';
        boxes.forEach((b, i) => {
            const bx = PAD + i * (boxW + boxGap);
            const by = cy;
            ctx.fillStyle = 'rgba(198,161,91,0.08)';
            ctx.strokeStyle = 'rgba(198,161,91,0.4)';
            ctx.lineWidth = 2;
            roundRect(ctx, bx, by, boxW, boxH, 18);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#C6A15B';
            ctx.font = "18px Georgia, serif";
            ctx.fillText('★ ★ ★ ★ ★', bx + boxW / 2, by + 32);

            ctx.fillStyle = '#A0938C';
            ctx.font = "600 16px 'Outfit', Arial, sans-serif";
            setLetterSpacing(ctx, 2);
            ctx.fillText(b.label, bx + boxW / 2, by + 58);
            setLetterSpacing(ctx, 0);

            ctx.fillStyle = '#E4CB94';
            ctx.font = "600 50px Cinzel, Georgia, serif";
            ctx.fillText(String(b.valor), bx + boxW / 2, by + 112);
        });
        cy += boxH;

        // rodapé sempre ancorado bem acima da base (fora da zona onde o Instagram
        // sobrepõe a caixa de resposta dos Stories, ~300px inferiores)
        cy = Math.max(cy + 34, H - 300);

        drawOrnamentLine(ctx, cy, W, PAD);
        cy += 34;

        ctx.textAlign = 'center';
        ctx.fillStyle = '#E4CB94';
        ctx.font = "600 23px 'Outfit', Arial, sans-serif";
        setLetterSpacing(ctx, 3);
        ctx.fillText('CONFIRA MAIS EM', W / 2, cy);
        setLetterSpacing(ctx, 0);
        cy += 38;

        ctx.fillStyle = '#C6A15B';
        ctx.font = "500 30px 'Outfit', Arial, sans-serif";
        ctx.fillText('fellypehwlly-adega.space', W / 2, cy);
        cy += 46;

        ctx.fillStyle = '#8A7D76';
        ctx.font = "500 20px 'Outfit', Arial, sans-serif";
        setLetterSpacing(ctx, 2);
        ctx.fillText('ADEGA FELLYPE & HWLLY', W / 2, cy);
        setLetterSpacing(ctx, 0);
        ctx.textAlign = 'left';

        // textura de grão + vinheta sutil (acabamento editorial)
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = 180; noiseCanvas.height = 180;
        const noiseCtx = noiseCanvas.getContext('2d');
        const noiseData = noiseCtx.createImageData(180, 180);
        for (let i = 0; i < noiseData.data.length; i += 4) {
            const v = Math.random() < 0.5 ? 0 : 255;
            noiseData.data[i] = v;
            noiseData.data[i + 1] = v;
            noiseData.data[i + 2] = v;
            noiseData.data[i + 3] = Math.random() * 22;
        }
        noiseCtx.putImageData(noiseData, 0, 0);
        ctx.fillStyle = ctx.createPattern(noiseCanvas, 'repeat');
        ctx.fillRect(0, 0, W, H);

        const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.72);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);

        // moldura dourada
        ctx.strokeStyle = 'rgba(198,161,91,0.55)';
        ctx.lineWidth = 3;
        roundRect(ctx, FRAME, FRAME, W - FRAME * 2, H - FRAME * 2, 24);
        ctx.stroke();

        return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png', 0.95));
    }

    window.WineModal = {
        open(vinho) {
            vinhoAtual = vinho;
            imagemAtualFile = null;
            this._prefetchImage(vinho);
            let backdrop = document.getElementById('wine-modal-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'wine-modal-backdrop';
                backdrop.className = 'wine-modal-backdrop';
                backdrop.innerHTML = `
                    <div class="wine-modal" role="dialog" aria-modal="true" aria-labelledby="modal-wine-name">
                        <button class="wine-modal-close" onclick="WineModal.close()" data-i18n-aria-label="modal.close" aria-label="${Tm('modal.close')}">
                            <i class="fas fa-times" aria-hidden="true"></i>
                        </button>
                        <img id="modal-img" class="wine-modal-img" src="" alt="" data-fallback="${window.IMG_FALLBACK}">
                        <div class="wine-modal-body">
                            <h2 class="wine-modal-name" id="modal-wine-name"></h2>
                            <p class="wine-modal-produtor" id="modal-produtor"></p>
                            <div class="wine-modal-share wine-modal-share-top">
                                <button class="share-btn share-whatsapp" onclick="WineModal.shareWhatsApp()">
                                    <img class="share-icon" src="assets/whatsapp-icon.png" alt="" aria-hidden="true"> WhatsApp
                                </button>
                                <button class="share-btn share-instagram" onclick="WineModal.shareInstagram()">
                                    <img class="share-icon" src="assets/instagram-icon.png" alt="" aria-hidden="true"> Instagram
                                </button>
                            </div>
                            <div class="wine-modal-grid" id="modal-grid"></div>
                            <div class="wine-modal-notas" id="modal-notas"></div>
                            <div class="wine-modal-artigo" id="modal-artigo"></div>
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
            img.alt = vinho.nome ? Tm('modal.label_prefix') + vinho.nome : Tm('modal.wine_photo');

            document.getElementById('modal-wine-name').textContent = vinho.nome || Tm('modal.special_label');
            document.getElementById('modal-produtor').textContent = vinho.produtor || vinho.vinicola || '';

            const campos = [
                { label: Tm('modal.country'), value: trPais(vinho.pais) },
                { label: Tm('modal.region'), value: vinho.regiao },
                { label: Tm('modal.grapes'), value: vinho.uva },
                { label: Tm('modal.type'), value: trTipo(vinho.tipo) },
                { label: Tm('modal.vintage'), value: vinho.safra },
                { label: Tm('modal.abv'), value: vinho.teor },
                { label: Tm('modal.classification'), value: trClass(vinho.classificacao) },
                { label: Tm('modal.tasted_on'), value: vinho.data },
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

            this._renderArtigo();

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
        },
        buildShareCaption(vinho) {
            const v = vinho || vinhoAtual || {};
            const partes = [`🍷 ${v.nome || 'Vinho'}`];
            if (v.pais) partes.push(v.pais);
            if (v.uva) partes.push(v.uva);

            const notaF = v.notaF || v['Pontuação Fellype'];
            const notaH = v.notaH || v['Pontuação Hwlly'];
            if (notaF || notaH) {
                const notas = [];
                if (notaF) notas.push(`Fellype ★${notaF}`);
                if (notaH) notas.push(`Hwlly ★${notaH}`);
                partes.push(notas.join(' | '));
            }

            return `${partes.join(' · ')}\n🥂 Adega Fellype & Hwlly`;
        },
        buildShareUrl(vinho) {
            const v = vinho || vinhoAtual || {};
            const base = `${location.origin}/catalogo.html`;
            return v.nome ? `${base}?vinho=${encodeURIComponent(v.nome)}` : base;
        },
        async _fetchImageBlob(url) {
            try {
                const resp = await fetch(url);
                if (!resp.ok) return null;
                const blob = await resp.blob();
                return blob.type.startsWith('image/') ? blob : null;
            } catch (e) {
                return null;
            }
        },
        async _prefetchImage(vinho) {
            if (!vinho) return;
            try {
                const [fotoBlob, flagBlob] = await Promise.all([
                    vinho.foto ? this._fetchImageBlob(vinho.foto) : null,
                    vinho.pais ? this._fetchImageBlob(getFlagUrl(vinho.pais)) : null,
                ]);
                if (vinhoAtual !== vinho) return;

                const cardBlob = await buildShareCard(vinho, fotoBlob, flagBlob);
                if (!cardBlob || vinhoAtual !== vinho) return;

                const nomeArq = (vinho.nome || 'vinho')
                    .normalize('NFD').replace(/[̀-ͯ]/g, '')
                    .replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'vinho';
                imagemAtualFile = new File([cardBlob], `${nomeArq}.png`, { type: 'image/png' });
            } catch (e) {
                imagemAtualFile = null;
            }
        },
        shareWhatsApp() {
            const v = vinhoAtual || {};
            const url = this.buildShareUrl(v);
            const texto = `${this.buildShareCaption(v)}\n${url}`;

            if (imagemAtualFile && navigator.canShare && navigator.canShare({ files: [imagemAtualFile] })) {
                navigator.share({ files: [imagemAtualFile], text: texto, title: v.nome || 'Vinho' }).catch(() => {});
                return;
            }

            window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
            if (!imagemAtualFile) this._toast('A imagem ainda não carregou para anexar — enviamos o link do vinho.');
        },
        shareInstagram() {
            const v = vinhoAtual || {};
            const url = this.buildShareUrl(v);
            const texto = `${this.buildShareCaption(v)}\n${url}`;

            if (imagemAtualFile && navigator.canShare && navigator.canShare({ files: [imagemAtualFile] })) {
                navigator.share({ files: [imagemAtualFile], text: texto, title: v.nome || 'Vinho' }).catch(() => {});
                return;
            }

            if (navigator.share) {
                navigator.share({ title: v.nome || 'Vinho', text: texto, url }).catch(() => {});
                return;
            }

            this._copyAndOpenInstagram(texto);
        },
        async _copyAndOpenInstagram(texto) {
            try {
                await navigator.clipboard.writeText(texto);
                this._toast('Link copiado! Cole no Instagram 📋');
            } catch (e) {
                this._toast('Não foi possível copiar o link automaticamente.');
            }
            window.open('https://instagram.com', '_blank');
        },
        _toast(msg) {
            let t = document.getElementById('wine-share-toast');
            if (!t) {
                t = document.createElement('div');
                t.id = 'wine-share-toast';
                t.className = 'wine-share-toast';
                document.body.appendChild(t);
            }
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(this._toastTimer);
            this._toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
        },

        /* ---- Blog: exibição do artigo (gerado e publicado só no cadastro) ---- */
        _escapeHtml(str) {
            const d = document.createElement('div');
            d.textContent = str || '';
            return d.innerHTML;
        },
        _renderArtigo() {
            const v = vinhoAtual || {};
            const box = document.getElementById('modal-artigo');
            if (!box) return;

            if (v.artigoPublicado && v.artigo) {
                box.innerHTML = `
                    <div class="wine-modal-artigo-header">
                        <span class="wine-modal-artigo-titulo"><i class="fas fa-feather-alt" aria-hidden="true"></i> ${Tm('blog.article_label')}</span>
                    </div>
                    <p class="wine-modal-artigo-texto">${this._escapeHtml(v.artigo).replace(/\n/g, '<br>')}</p>`;
                return;
            }

            box.innerHTML = '';
        }
    };

    /* Reabre com os mesmos dados ao trocar de idioma, se a modal estiver aberta */
    window.addEventListener('i18n:change', () => {
        const b = document.getElementById('wine-modal-backdrop');
        if (b && b.classList.contains('open') && vinhoAtual) WineModal.open(vinhoAtual);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') WineModal.close();
    });
})();
