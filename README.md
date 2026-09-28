# Adega Fellype & Hwlly

Site pessoal de registro de vinhos: catálogo, escolhidos do mês, exploração por país / uva / vinícola, estatísticas, jogos e cadastro conversacional. Os dados vêm de uma planilha via Google Apps Script.

## Estrutura

```
index.html        Home (citação, indicadores, jornada, sommeliers)
catalogo.html     Catálogo com busca, filtros e ordenação
melhores.html     Escolhidos de cada mês
paises.html       Acordeão por país
uvas.html         Acordeão por casta (+ descrição via IA)
vinicolas.html    Acordeão por produtor, com busca
stats.html        Painel de estatísticas (Chart.js)
games.html        Quizzes e forca temáticos
cadastro.html     Registro de vinho em formato de chat
shared.css        Design system (tokens, navbar, rodapé, modal)
nav.js            Marca, navbar, rodapé, cache de dados e modal do vinho
sw.js             Service worker (PWA offline)
assets/           Logo, favicon, ícones PWA, imagem de compartilhamento, placeholders
```

## Paleta (refatoração 2.0)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#15100F` | Fundo (carvão quente, não preto puro) |
| `--bg-deep` | `#1C1413` | Topo de cabeçalhos e degradês |
| `--card` / `--card-alt` | `#1D1716` / `#241D1B` | Superfícies |
| `--vinho-escuro` | `#3B0E1A` | Base bordô |
| `--vinho` | `#5A1728` | Bordô médio |
| `--vinho-vivo` | `#8A2233` | Ações, estados ativos |
| `--dourado` | `#C6A15B` | Latão champanhe (antigo ouro saturado) |
| `--dourado-claro` | `#E4CB94` | Títulos e destaques |
| `--texto` / `--subtexto` | `#ECE4DD` / `#A0938C` | Texto e apoio |

Tipografia (redesign 3.0): **Cormorant Garamond** nos títulos e números, **Outfit** na interface e no texto, **Cinzel** só na marca.

## Redesign 3.0 (set/2026)

- Home mostra o **Escolhido do mês** logo na primeira tela (garrafa, notas dos dois e ficha), seguido dos números da adega, **Últimos brindes** (4 rótulos mais recentes da planilha), origens e sommeliers. A citação virou o fecho da página.
- Caixa-alta espaçada só em micro-rótulos (classe `.rotulo`); nenhum texto abaixo de 12px.
- Cores sólidas: sem degradês em botões, cabeçalhos e cards; profundidade por contraste entre superfícies.
- Menu enxuto: Catálogo · Do mês · Estatísticas · Explorar ▾ (países, uvas, vinícolas, games) · Blog + botão **Registrar vinho**. No celular, barra inferior fixa (Início, Catálogo, +, Do mês, Explorar).
- Catálogo com uma barra única de controles (busca, tipo, ordenação, visualização) e cards com nota média.
- Quando a planilha falha, a home mostra a apresentação da adega e um único aviso com “Tentar de novo”; os números mostram “Atualizado em…”.
- Correção: o link “Ir para o conteúdo” não aparece mais como faixa no topo do celular.

## Voltar ao design anterior (rollback)

A versão exata do site antes do redesign está guardada no branch **`backup/pre-redesign`** (commit `7bba7de`).

- **Mais simples:** fazer merge do pull request **“Voltar ao design anterior”** (branch `rollback/design-anterior`), que já desfaz o redesign e sobe a versão do cache.
- **Manual:** `git revert -m 1 <commit do merge do redesign>` no `main`, e depois incremente `CACHE_NAME` em `sw.js` (senão quem já abriu o site continua vendo a versão em cache).

## O que mudou nesta refatoração

- Paleta inteira reescrita em neutros quentes + bordô e latão (mais contraste e menos saturação).
- Identidade própria: monograma **FH** em `assets/` (favicon SVG, ícones PWA 180/192/512, versão maskable e imagem de compartilhamento 1200×630) — nada mais de ícone de banco de imagens externo.
- Navbar com marca (símbolo + nome + assinatura), botão “Registrar” destacado, menu mobile e dropdown com alvos de toque ≥ 44px.
- Acessibilidade: link “ir para o conteúdo”, foco visível em todo o site, `aria-*` no menu e no modal, foco devolvido ao fechar o modal, suporte a `prefers-reduced-motion`.
- Emojis decorativos substituídos por ícones tipográficos (Font Awesome); emoji mantido apenas onde tem significado (medalhas, assinatura do rodapé).
- Imagens: placeholders locais em SVG (`wine-placeholder.svg`, `avatar-fallback.svg`) com fallback global para qualquer imagem quebrada; cards com proporção fixa (sem “salto” de layout).
- PWA revisado: manifest com ícones locais, atalhos e cores novas; service worker `adega-v10` que nunca serve dados da planilha do cache.

## Trocar as fotos dos sommeliers (Leblonzito & Ipanemita)

Hoje as fotos ainda são carregadas de links externos. Para deixá-las definitivas:

1. Salve as fotos em `assets/leblonzito.jpg` e `assets/ipanemita.jpg`.
2. Substitua as URLs externas por esses caminhos em `index.html`, `paises.html`, `uvas.html`, `vinicolas.html` e nas constantes `IMG_L` / `IMG_I` de `cadastro.html`.

Se um link externo falhar, o site já mostra automaticamente `assets/avatar-fallback.svg`.


## Cache dos dados da planilha

A planilha (Google Apps Script) pode levar vários segundos para responder, então as páginas não ficam esperando por ela:

- ao abrir a página ou dar F5, mostra a cópia salva no navegador na hora e consulta a planilha por trás; se vier algo novo (um vinho recém-registrado em qualquer aparelho), a página **se atualiza sozinha** em poucos segundos;
- só a primeira visita de cada navegador espera a planilha.

- página deixada aberta: confere a planilha sozinha a cada 5 min (e ao voltar para a aba) e se atualiza se houver novidade;
- quem registra um vinho tem o cache apagado na hora, então vê o vinho novo já na próxima página.

Os dados ficam no **IndexedDB** do navegador (as fotos em base64 deixam a planilha com vários MB, acima do limite de ~5 MB do `localStorage`). A validade fica em `CACHE_VALIDADE_MS` no `nav.js`; o evento que as páginas escutam para se redesenhar é `adega:dados-atualizados`.

## Publicação

Site estático (GitHub Pages, domínio em `CNAME`). Ao publicar uma alteração de CSS/JS, incremente `CACHE_NAME` em `sw.js` para forçar a atualização nos dispositivos já instalados.
