/* =====================================================
   ADEGA FELLYPE & HWLLY — Motor de internacionalização
   i18n.js · dicionários pt/en/es/it/fr, seletor de idioma,
   tradução de campos dinâmicos (país/tipo/classificação/mês)
   ===================================================== */

(function () {
    'use strict';

    var SUPPORTED = ['pt', 'en', 'es', 'it', 'fr'];
    var DEFAULT_LANG = 'pt';

    /* Emoji de bandeira (🇧🇷 etc.) não renderiza como imagem em vários navegadores/SOs
       Windows — aparece como o código de duas letras dentro de uma caixa. O resto do
       site (catálogo, países, melhores do mês) já usa imagens da flagcdn.com para as
       bandeiras, então o seletor de idioma segue o mesmo padrão para funcionar em
       qualquer plataforma. */
    var FLAG_CODES = { pt: 'br', en: 'gb', es: 'es', it: 'it', fr: 'fr' };
    var LANG_NAMES = {
        pt: 'Português', en: 'English', es: 'Español', it: 'Italiano', fr: 'Français'
    };

    function flagUrl(lang) {
        return 'https://flagcdn.com/w40/' + (FLAG_CODES[lang] || 'un') + '.png';
    }

    /* ============================================================
       DICIONÁRIO DE INTERFACE (textos fixos)
       ============================================================ */
    var DICT = {
        pt: {
            nav: {
                home: 'Início', catalog: 'Catálogo', best: 'Do Mês', games: 'Games',
                explore: 'Explorar', countries: 'Por países', grapes: 'Por uvas',
                wineries: 'Vinícolas', stats: 'Estatísticas', register: 'Registrar',
                skip: 'Ir para o conteúdo', open_menu: 'Abrir menu',
                home_aria: 'Fellype & Hwlly — página inicial', tagline: 'Adega pessoal'
            },
            footer: {
                tagline: 'Feito com ❤️ para as nossas memórias.',
                curation: 'Curadoria de Leblonzito & Ipanemita'
            },
            modal: {
                close: 'Fechar detalhes', country: 'País', region: 'Região', grapes: 'Uva(s)',
                type: 'Tipo', vintage: 'Safra', abv: 'Teor alcoólico', classification: 'Classificação',
                tasted_on: 'Degustado em', special_label: 'Rótulo especial',
                wine_photo: 'Foto do vinho', label_prefix: 'Rótulo: '
            },
            switcher: { label: 'Idioma' },
            index: {
                hero_eyebrow: 'Adega pessoal',
                hero_quote: '"Este cantinho é só nosso: um lembrete afetuoso de cada taça, cada viagem e cada história que vivemos juntos no universo do vinho."',
                hero_intro: 'Desde o primeiro brinde, guardamos aqui cada rótulo, cada nota e cada memória — organizados por país, uva e vinícola.',
                btn_explore_catalog: 'Explorar o catálogo', btn_best_of_month: 'Melhores do mês',
                stats_eyebrow: 'Nossa adega em números', stats_title: 'O retrato de tudo que brindamos',
                stats_sub: 'Cada rótulo registrado virou dado: origens, castas, notas e a evolução mês a mês.',
                stat_wines: 'Vinhos Degustados', stat_countries: 'Países Explorados',
                stat_grapes: 'Castas Únicas', stat_avg: 'Nota Média',
                panel_top_origins: 'Origens mais visitadas', panel_top_wine: 'Rótulo mais bem avaliado',
                cta_full_stats: 'Ver análise completa da adega',
                journey_title: 'Nossa Jornada Sensorial',
                journey_intro: 'Cada garrafa aberta é uma nova página escrita. De vinícolas históricas a pequenos produtores, nossa adega digital reflete nossa evolução e paixão compartilhada.',
                exp_terroir_title: 'Terroirs Favoritos', exp_terroir_text: 'De Portugal ao Uruguai, passando por Mendoza e pelas colinas de Lisboa.',
                exp_grapes_title: 'Castas Prediletas', exp_grapes_text: 'O frescor do Chardonnay, a intensidade da Syrah e a complexidade dos blends italianos.',
                exp_labels_title: 'Rótulos de Destaque', exp_labels_text: 'Experiências memoráveis com Parras Wine, Undurraga e tesouros garimpados.',
                exp_time_title: 'Cápsula do Tempo', exp_time_text: 'Aqui, cada taça é uma lembrança pronta para ser revisitada brinde a brinde.',
                sommeliers_title: 'Sommeliers da Casa',
                leblonzito_name: 'Leblonzito', leblonzito_quote: '"Curador de brancos leves."',
                ipanemita_name: 'Ipanemita', ipanemita_quote: '"Especialista em tintos de corpo."',
                btn_explore_countries: 'Explorar por países',
                error_loading: 'Dados indisponíveis agora.',
                no_origin: 'Nenhuma origem registrada ainda.',
                no_ratings: 'Sem avaliações registradas ainda.'
            },
            catalogo: {
                title: 'Nossa Adega', subtitle: 'Todos os rótulos que já dividimos, com a nota de cada um de nós.',
                search_placeholder: 'Pesquisar vinho, uva ou país...',
                filter_all: 'Todos', filter_red: 'Tintos', filter_white: 'Brancos', filter_rose: 'Rosés', filter_sparkling: 'Espumantes',
                sort_label: 'Ordenar:', sort_recent: 'Mais Recentes', sort_rating_desc: 'Maior Nota', sort_rating_asc: 'Menor Nota', sort_az: 'A–Z',
                empty_title: 'Nenhum vinho encontrado', empty_text: 'Tente outros termos ou limpe os filtros.', btn_clear: 'Limpar filtros',
                result_singular: 'vinho', result_plural: 'vinhos',
                error_title: 'Erro ao carregar a adega', error_text: 'Tente recarregar a página.',
                grape_not_informed: 'Uva não informada', origin_not_informed: 'Origem não informada',
                special_label: 'Rótulo Especial'
            },
            melhores: {
                title: 'Melhores do Mês', subtitle: 'Os rótulos que mais marcaram cada período da nossa adega.',
                error: 'Erro ao carregar. Tente novamente.',
                special_wine: 'Vinho Especial', grape_not_informed: 'Uva não informada', origin_not_informed: 'Origem não informada',
                see_first: 'Ver 1º escolhido', see_second: 'Ver 2º escolhido', default_label: 'Destaque'
            },
            paises: {
                title: 'Mapa da Adega', subtitle: 'Nossa coleção organizada por origem e terroir.',
                error: 'Erro ao carregar o mapa. Tente novamente.'
            },
            uvas: {
                title: 'Variedades de Uvas', subtitle: 'A essência de cada casta que já passou pela nossa mesa.',
                error: 'Erro ao carregar uvas. Tente novamente.',
                btn_about: 'Sobre a uva', consulting: 'Consultando...', error_short: 'Erro',
                no_description: 'Informação não disponível.'
            },
            vinicolas: {
                title: 'Vinícolas & Produtores', subtitle: 'Cada garrafa tem uma assinatura por trás.',
                search_placeholder: 'Buscar vinícola ou produtor...',
                error: 'Não foi possível carregar as vinícolas.\nTente novamente mais tarde.',
                empty: 'Nenhuma vinícola encontrada para essa busca.',
                unknown_producer: 'Produtor Desconhecido'
            },
            games: {
                title: 'Lounge de Jogos', subtitle: 'Desafios criados a partir dos vinhos que já registramos.',
                score_label: 'Taças de Ouro:', preparing: 'Preparando as taças...',
                badge_sheet: 'Planilha', badge_puzzle: 'Puzzle',
                card1_title: 'Mestre do Terroir', card1_desc: 'De qual país é este rótulo?',
                card2_title: 'Degustação Cega', card2_desc: 'Qual uva compõe este vinho?',
                card3_title: 'Duelo de Paladares', card3_desc: 'Quem deu a maior nota para o vinho?',
                card4_title: 'Forca Etílica', card4_desc: 'Descubra a palavra do mundo dos vinhos.',
                btn_back: 'Voltar', dyn_title_placeholder: 'Título', dyn_name_placeholder: 'Nome do Vinho',
                dyn_question_placeholder: 'Pergunta?', consumed_on: 'Consumido em:',
                btn_next_round: 'Próxima Rodada', btn_new_word: 'Nova Palavra',
                errors_label: 'Erros:',
                few_wines: 'Poucos vinhos na adega para jogar!',
                quiz_pais_title: 'Mestre do Terroir', quiz_pais_question: 'De qual país é este vinho?',
                quiz_uva_title: 'Degustação Cega', quiz_uva_question: 'Qual a uva principal deste rótulo?',
                quiz_duelo_title: 'Duelo de Paladares', quiz_duelo_question: 'Quem deu a nota mais alta para este vinho?',
                correct_pais: 'Acertou! +10 Taças 🏆', wrong_pais: 'Errou! Era do(a) {val}',
                correct_uva: 'Exato! +10 Taças 🍇', wrong_uva: 'Na verdade era {val}',
                duelo_tie: 'Notas Iguais (Empate)', duelo_correct: 'Acertou! {msg}', duelo_wrong: 'Errou! {msg}',
                hang_saved: 'Você salvou o vinho! +20 Taças 🍷', hang_broke: 'A garrafa quebrou! A palavra era {word}.',
                letter_aria: 'Letra {letter}', date_not_informed: 'Data não informada'
            },
            stats: {
                title: 'Estatísticas da Adega', subtitle: 'Os números por trás de cada gole que registramos.',
                filter_all_time: 'Toda a adega',
                hero_default: 'Retrato da adega', hero_period: 'Retrato de {periodo}',
                hero_unit_singular: 'rótulo registrado', hero_unit_plural: 'rótulos registrados',
                hero_none: 'Nenhum rótulo registrado neste período.',
                hero_phrase: 'Nossa adega passeia por {paises} e {castas} diferentes.{origem}{casta}.',
                hero_top_origin: ' A origem que mais volta à mesa é {val}',
                hero_top_grape: ', e a casta preferida é {val}',
                mini_avg: 'Nota média', mini_countries: 'Países', mini_grapes: 'Castas', mini_rated: 'Avaliados',
                podium_title: 'Pódio dos rótulos', podium_empty: 'Nenhuma avaliação neste período.',
                card_wines: 'Vinhos na adega', card_avg: 'Média geral', card_avg_sub: 'de {n} avaliados',
                card_top_country: 'País favorito', card_top_grape: 'Uva favorita', card_top_type: 'Estilo predileto',
                card_top_rating: 'Maior nota',
                chart_countries: 'Distribuição por país', chart_grapes: 'Top 10 variedades de uva',
                chart_time: 'Evolução ao longo do tempo', chart_types: 'Estilos na taça',
                chart_ratings: 'Como avaliamos', chart_duel: 'Fellype vs Hwlly',
                empty_countries: 'Sem origens registradas neste período.', empty_grapes: 'Sem castas registradas neste período.',
                empty_time: 'Sem datas de consumo registradas ainda.', empty_types: 'Estilos ainda não classificados na planilha.',
                empty_ratings: 'Nenhuma nota registrada neste período.', empty_duel: 'Avaliações duplas ainda não registradas.',
                insight_country_share: '{pais} responde por {pct}% da adega',
                insight_time_peak: 'Período mais generoso: {periodo} com {n}',
                insight_type_share: '{tipo}s são {pct}% do que abrimos',
                insight_ratings_range: 'A maioria dos nossos vinhos fica entre {faixa}',
                insight_duel_tie: 'Notas praticamente idênticas — concordamos em {pct}% dos rótulos',
                insight_duel_diff: '{quem} dá +{diff} que {outro} · concordamos em {pct}%',
                error_title: 'Não conseguimos carregar as estatísticas agora.', btn_retry: 'Tentar novamente',
                axis_fellype: 'Nota Fellype', axis_hwlly: 'Nota Hwlly',
                range_under6: 'até 5,9', range_6to7: '6 – 6,9', range_7to8: '7 – 7,9', range_8to9: '8 – 8,9', range_9to10: '9 – 10',
                range_and: ' e ', filter_period_aria: 'Filtrar por período', no_name: 'Sem nome', grape_unidentified: 'Não identificada'
            },
            cadastro: {
                dialog_title: 'Avaliação Final', label_rating_fellype: 'Nota Fellype', label_rating_hwlly: 'Nota Hwlly',
                label_would_buy: 'Voltaria a comprar?', opt_yes: 'Sim', opt_no: 'Não',
                label_date: 'Data do Consumo', label_photo: 'Foto do Brinde', btn_select_photo: 'Selecionar ou Tirar Foto',
                photo_preview_alt: 'Pré-visualização da foto', btn_finish: 'Finalizar Brinde 🍷', btn_finishing: 'Eternizando Memória...',
                input_placeholder: 'Envie uma mensagem...', send_aria: 'Enviar', answer_aria: 'Sua resposta',
                undo_btn: '↩ Corrigir última resposta', undo_title: 'Corrigir última resposta',
                greeting: 'Olá! Sou o Leblonzito. Vamos registrar esse brinde? ',
                skip_hint: 'Pressione Enter para pular...', skip_manual: 'Preencher manualmente →',
                q_wine_name: 'Qual o nome do rótulo?', q_producer: 'Quem é o produtor ou vinícola?',
                q_classification: 'Qual a classificação? (Ex: Reserva, Blend...)', q_grape: 'Quais as uvas principais?',
                q_type: 'Qual o tipo? (Tinto, Branco, Rosé...)', q_year: 'Qual a safra (ano)?',
                q_country: 'De qual país ele é?', q_region: 'Qual a região?', q_abv: 'Qual o teor alcoólico?',
                q_password: 'Agora a senha de acesso para salvar:',
                sommelier_online: 'Sommelier Online', smart_curation: 'Curadoria Inteligente',
                select_confirm_label: 'Selecione os dados que deseja confirmar:', btn_confirm_selected: '✓ Confirmar selecionados',
                found_data: '{emoji} Encontrei alguns dados sobre esse vinho!\n\n{lista}\n\nVamos preencher o que faltou?',
                all_filled: '{emoji} Tudo preenchido pela IA!\n\n{lista}',
                autofilling: '{emoji} Preenchendo automaticamente:\n\n{lista}',
                validating: 'Validando acesso...', access_granted: 'Acesso autorizado! Hora de dar as notas e finalizar o brinde. 🍷',
                wrong_password: 'Senha incorreta. Tente novamente:',
                toast_success: '🍷 Brinde eternizado com sucesso!\n\nO vinho foi adicionado à nossa adega. Redirecionando para o catálogo...',
                toast_success_fallback: '✅ Brinde registrado! Redirecionando...',
                field_producer: 'Produtor', field_country: 'País', field_region: 'Região', field_grape: 'Uva',
                field_type: 'Tipo', field_year: 'Safra', field_abv: 'Teor', field_classification: 'Classificação',
                not_informed: 'Não informado', last_hint: 'Último: {val}',
                safra_label: 'Safra {val}'
            },
            common: {
                loading: 'Carregando...',
                wine_no_name: 'Vinho s/ Nome', grape_no_info: 'Uva s/ info', grape_unidentified: 'Não Identificada',
                view_details: 'Ver detalhes de {nome}', flag_of: 'Bandeira de {pais}',
                main_nav_aria: 'Navegação principal', back_to_top: 'Voltar ao topo'
            }
        },

        en: {
            nav: {
                home: 'Home', catalog: 'Catalog', best: 'Of the Month', games: 'Games',
                explore: 'Explore', countries: 'By Country', grapes: 'By Grape',
                wineries: 'Wineries', stats: 'Statistics', register: 'Register',
                skip: 'Skip to content', open_menu: 'Open menu',
                home_aria: 'Fellype & Hwlly — homepage', tagline: 'Personal cellar'
            },
            footer: {
                tagline: 'Made with ❤️ for our memories.',
                curation: 'Curated by Leblonzito & Ipanemita'
            },
            modal: {
                close: 'Close details', country: 'Country', region: 'Region', grapes: 'Grape(s)',
                type: 'Type', vintage: 'Vintage', abv: 'ABV', classification: 'Classification',
                tasted_on: 'Tasted on', special_label: 'Special label',
                wine_photo: 'Wine photo', label_prefix: 'Label: '
            },
            switcher: { label: 'Language' },
            index: {
                hero_eyebrow: 'Personal cellar',
                hero_quote: '"This little corner is all ours: a warm reminder of every glass, every trip and every story we’ve lived together in the world of wine."',
                hero_intro: 'Since our first toast, we’ve kept every label, every note and every memory here — organized by country, grape and winery.',
                btn_explore_catalog: 'Explore the catalog', btn_best_of_month: 'Best of the month',
                stats_eyebrow: 'Our cellar in numbers', stats_title: 'The portrait of everything we’ve toasted to',
                stats_sub: 'Every label we logged became data: origins, grapes, ratings and month-by-month growth.',
                stat_wines: 'Wines Tasted', stat_countries: 'Countries Explored',
                stat_grapes: 'Unique Grapes', stat_avg: 'Average Rating',
                panel_top_origins: 'Most visited origins', panel_top_wine: 'Highest-rated label',
                cta_full_stats: 'See the full cellar analysis',
                journey_title: 'Our Sensory Journey',
                journey_intro: 'Every bottle opened is a new page written. From historic wineries to small producers, our digital cellar reflects our growth and shared passion.',
                exp_terroir_title: 'Favorite Terroirs', exp_terroir_text: 'From Portugal to Uruguay, through Mendoza and the hills of Lisbon.',
                exp_grapes_title: 'Favorite Grapes', exp_grapes_text: 'The freshness of Chardonnay, the intensity of Syrah and the complexity of Italian blends.',
                exp_labels_title: 'Standout Labels', exp_labels_text: 'Memorable experiences with Parras Wine, Undurraga and hand-picked treasures.',
                exp_time_title: 'Time Capsule', exp_time_text: 'Here, every glass is a memory ready to be revisited, toast by toast.',
                sommeliers_title: 'House Sommeliers',
                leblonzito_name: 'Leblonzito', leblonzito_quote: '"Curator of light whites."',
                ipanemita_name: 'Ipanemita', ipanemita_quote: '"Specialist in full-bodied reds."',
                btn_explore_countries: 'Explore by country',
                error_loading: 'Data unavailable right now.',
                no_origin: 'No origin logged yet.',
                no_ratings: 'No ratings logged yet.'
            },
            catalogo: {
                title: 'Our Cellar', subtitle: 'Every label we’ve shared, with each of our ratings.',
                search_placeholder: 'Search wine, grape or country...',
                filter_all: 'All', filter_red: 'Reds', filter_white: 'Whites', filter_rose: 'Rosés', filter_sparkling: 'Sparkling',
                sort_label: 'Sort:', sort_recent: 'Most Recent', sort_rating_desc: 'Highest Rated', sort_rating_asc: 'Lowest Rated', sort_az: 'A–Z',
                empty_title: 'No wine found', empty_text: 'Try other terms or clear the filters.', btn_clear: 'Clear filters',
                result_singular: 'wine', result_plural: 'wines',
                error_title: 'Error loading the cellar', error_text: 'Try reloading the page.',
                grape_not_informed: 'Grape not informed', origin_not_informed: 'Origin not informed',
                special_label: 'Special Label'
            },
            melhores: {
                title: 'Best of the Month', subtitle: 'The labels that stood out in each period of our cellar.',
                error: 'Error loading. Please try again.',
                special_wine: 'Special Wine', grape_not_informed: 'Grape not informed', origin_not_informed: 'Origin not informed',
                see_first: 'See 1st pick', see_second: 'See 2nd pick', default_label: 'Highlight'
            },
            paises: {
                title: 'Cellar Map', subtitle: 'Our collection organized by origin and terroir.',
                error: 'Error loading the map. Please try again.'
            },
            uvas: {
                title: 'Grape Varieties', subtitle: 'The essence of every grape that has ever reached our table.',
                error: 'Error loading grapes. Please try again.',
                btn_about: 'About this grape', consulting: 'Looking it up...', error_short: 'Error',
                no_description: 'Information not available.'
            },
            vinicolas: {
                title: 'Wineries & Producers', subtitle: 'Every bottle has a signature behind it.',
                search_placeholder: 'Search winery or producer...',
                error: 'We couldn’t load the wineries.\nPlease try again later.',
                empty: 'No winery found for that search.',
                unknown_producer: 'Unknown Producer'
            },
            games: {
                title: 'Games Lounge', subtitle: 'Challenges built from the wines we’ve already logged.',
                score_label: 'Gold Cups:', preparing: 'Preparing the cups...',
                badge_sheet: 'Sheet', badge_puzzle: 'Puzzle',
                card1_title: 'Terroir Master', card1_desc: 'Which country is this label from?',
                card2_title: 'Blind Tasting', card2_desc: 'Which grape makes up this wine?',
                card3_title: 'Palate Duel', card3_desc: 'Who gave this wine the higher score?',
                card4_title: 'Wine Hangman', card4_desc: 'Guess the word from the world of wine.',
                btn_back: 'Back', dyn_title_placeholder: 'Title', dyn_name_placeholder: 'Wine Name',
                dyn_question_placeholder: 'Question?', consumed_on: 'Tasted on:',
                btn_next_round: 'Next Round', btn_new_word: 'New Word',
                errors_label: 'Mistakes:',
                few_wines: 'Not enough wines in the cellar to play!',
                quiz_pais_title: 'Terroir Master', quiz_pais_question: 'Which country is this wine from?',
                quiz_uva_title: 'Blind Tasting', quiz_uva_question: 'What is the main grape of this label?',
                quiz_duelo_title: 'Palate Duel', quiz_duelo_question: 'Who gave the higher score to this wine?',
                correct_pais: 'Correct! +10 Cups 🏆', wrong_pais: 'Wrong! It was from {val}',
                correct_uva: 'Exactly! +10 Cups 🍇', wrong_uva: 'It was actually {val}',
                duelo_tie: 'Equal Scores (Tie)', duelo_correct: 'Correct! {msg}', duelo_wrong: 'Wrong! {msg}',
                hang_saved: 'You saved the wine! +20 Cups 🍷', hang_broke: 'The bottle broke! The word was {word}.',
                letter_aria: 'Letter {letter}', date_not_informed: 'Date not informed'
            },
            stats: {
                title: 'Cellar Statistics', subtitle: 'The numbers behind every sip we’ve logged.',
                filter_all_time: 'Whole cellar',
                hero_default: 'Cellar portrait', hero_period: 'Portrait of {periodo}',
                hero_unit_singular: 'label registered', hero_unit_plural: 'labels registered',
                hero_none: 'No labels registered in this period.',
                hero_phrase: 'Our cellar spans {paises} and {castas}.{origem}{casta}.',
                hero_top_origin: ' The origin we return to most is {val}',
                hero_top_grape: ', and our favorite grape is {val}',
                mini_avg: 'Average rating', mini_countries: 'Countries', mini_grapes: 'Grapes', mini_rated: 'Rated',
                podium_title: 'Top-rated labels', podium_empty: 'No ratings in this period.',
                card_wines: 'Wines in the cellar', card_avg: 'Overall average', card_avg_sub: 'of {n} rated',
                card_top_country: 'Favorite country', card_top_grape: 'Favorite grape', card_top_type: 'Favorite style',
                card_top_rating: 'Highest rating',
                chart_countries: 'Distribution by country', chart_grapes: 'Top 10 grape varieties',
                chart_time: 'Evolution over time', chart_types: 'Styles in the glass',
                chart_ratings: 'How we rate', chart_duel: 'Fellype vs Hwlly',
                empty_countries: 'No origins registered in this period.', empty_grapes: 'No grapes registered in this period.',
                empty_time: 'No tasting dates registered yet.', empty_types: 'Styles not classified in the sheet yet.',
                empty_ratings: 'No ratings registered in this period.', empty_duel: 'No dual ratings registered yet.',
                insight_country_share: '{pais} accounts for {pct}% of the cellar',
                insight_time_peak: 'Most generous period: {periodo} with {n}',
                insight_type_share: '{tipo} makes up {pct}% of what we open',
                insight_ratings_range: 'Most of our wines fall between {faixa}',
                insight_duel_tie: 'Nearly identical scores — we agree on {pct}% of the labels',
                insight_duel_diff: '{quem} rates +{diff} higher than {outro} · we agree on {pct}%',
                error_title: 'We couldn’t load the statistics right now.', btn_retry: 'Try again',
                axis_fellype: 'Fellype Score', axis_hwlly: 'Hwlly Score',
                range_under6: 'up to 5.9', range_6to7: '6 – 6.9', range_7to8: '7 – 7.9', range_8to9: '8 – 8.9', range_9to10: '9 – 10',
                range_and: ' and ', filter_period_aria: 'Filter by period', no_name: 'No name', grape_unidentified: 'Unidentified'
            },
            cadastro: {
                dialog_title: 'Final Rating', label_rating_fellype: 'Fellype’s Score', label_rating_hwlly: 'Hwlly’s Score',
                label_would_buy: 'Would you buy it again?', opt_yes: 'Yes', opt_no: 'No',
                label_date: 'Date Tasted', label_photo: 'Toast Photo', btn_select_photo: 'Select or Take Photo',
                photo_preview_alt: 'Photo preview', btn_finish: 'Finish Toast 🍷', btn_finishing: 'Immortalizing Memory...',
                input_placeholder: 'Send a message...', send_aria: 'Send', answer_aria: 'Your answer',
                undo_btn: '↩ Fix last answer', undo_title: 'Fix last answer',
                greeting: 'Hi! I’m Leblonzito. Shall we log this toast? ',
                skip_hint: 'Press Enter to skip...', skip_manual: 'Fill in manually →',
                q_wine_name: 'What’s the name of the label?', q_producer: 'Who’s the producer or winery?',
                q_classification: 'What’s the classification? (E.g.: Reserve, Blend...)', q_grape: 'What are the main grapes?',
                q_type: 'What’s the type? (Red, White, Rosé...)', q_year: 'What’s the vintage (year)?',
                q_country: 'Which country is it from?', q_region: 'What’s the region?', q_abv: 'What’s the ABV?',
                q_password: 'Now the access password to save:',
                sommelier_online: 'Sommelier Online', smart_curation: 'Smart Curation',
                select_confirm_label: 'Select the data you want to confirm:', btn_confirm_selected: '✓ Confirm selected',
                found_data: '{emoji} I found some data about this wine!\n\n{lista}\n\nShall we fill in what’s missing?',
                all_filled: '{emoji} Everything filled in by the AI!\n\n{lista}',
                autofilling: '{emoji} Auto-filling:\n\n{lista}',
                validating: 'Validating access...', access_granted: 'Access granted! Time to rate and finish the toast. 🍷',
                wrong_password: 'Wrong password. Try again:',
                toast_success: '🍷 Toast immortalized successfully!\n\nThe wine was added to our cellar. Redirecting to the catalog...',
                toast_success_fallback: '✅ Toast logged! Redirecting...',
                field_producer: 'Producer', field_country: 'Country', field_region: 'Region', field_grape: 'Grape',
                field_type: 'Type', field_year: 'Vintage', field_abv: 'ABV', field_classification: 'Classification',
                not_informed: 'Not informed', last_hint: 'Last: {val}',
                safra_label: 'Vintage {val}'
            },
            common: {
                loading: 'Loading...',
                wine_no_name: 'Wine w/o Name', grape_no_info: 'Grape w/o info', grape_unidentified: 'Unidentified',
                view_details: 'View details of {nome}', flag_of: 'Flag of {pais}',
                main_nav_aria: 'Main navigation', back_to_top: 'Back to top'
            }
        },

        es: {
            nav: {
                home: 'Inicio', catalog: 'Catálogo', best: 'Del Mes', games: 'Juegos',
                explore: 'Explorar', countries: 'Por países', grapes: 'Por uvas',
                wineries: 'Bodegas', stats: 'Estadísticas', register: 'Registrar',
                skip: 'Ir al contenido', open_menu: 'Abrir menú',
                home_aria: 'Fellype & Hwlly — página de inicio', tagline: 'Bodega personal'
            },
            footer: {
                tagline: 'Hecho con ❤️ para nuestros recuerdos.',
                curation: 'Curaduría de Leblonzito & Ipanemita'
            },
            modal: {
                close: 'Cerrar detalles', country: 'País', region: 'Región', grapes: 'Uva(s)',
                type: 'Tipo', vintage: 'Añada', abv: 'Graduación alcohólica', classification: 'Clasificación',
                tasted_on: 'Degustado el', special_label: 'Etiqueta especial',
                wine_photo: 'Foto del vino', label_prefix: 'Etiqueta: '
            },
            switcher: { label: 'Idioma' },
            index: {
                hero_eyebrow: 'Bodega personal',
                hero_quote: '"Este rincón es solo nuestro: un recuerdo cariñoso de cada copa, cada viaje y cada historia que vivimos juntos en el universo del vino."',
                hero_intro: 'Desde el primer brindis, guardamos aquí cada etiqueta, cada nota y cada recuerdo, organizados por país, uva y bodega.',
                btn_explore_catalog: 'Explorar el catálogo', btn_best_of_month: 'Mejores del mes',
                stats_eyebrow: 'Nuestra bodega en números', stats_title: 'El retrato de todo lo que brindamos',
                stats_sub: 'Cada etiqueta registrada se volvió dato: orígenes, uvas, notas y la evolución mes a mes.',
                stat_wines: 'Vinos Catados', stat_countries: 'Países Explorados',
                stat_grapes: 'Uvas Únicas', stat_avg: 'Nota Media',
                panel_top_origins: 'Orígenes más visitados', panel_top_wine: 'Etiqueta mejor valorada',
                cta_full_stats: 'Ver análisis completo de la bodega',
                journey_title: 'Nuestro Viaje Sensorial',
                journey_intro: 'Cada botella abierta es una nueva página escrita. De bodegas históricas a pequeños productores, nuestra bodega digital refleja nuestra evolución y pasión compartida.',
                exp_terroir_title: 'Terruños Favoritos', exp_terroir_text: 'De Portugal a Uruguay, pasando por Mendoza y las colinas de Lisboa.',
                exp_grapes_title: 'Uvas Predilectas', exp_grapes_text: 'El frescor del Chardonnay, la intensidad de la Syrah y la complejidad de los blends italianos.',
                exp_labels_title: 'Etiquetas Destacadas', exp_labels_text: 'Experiencias memorables con Parras Wine, Undurraga y tesoros descubiertos.',
                exp_time_title: 'Cápsula del Tiempo', exp_time_text: 'Aquí, cada copa es un recuerdo listo para ser revisitado, brindis a brindis.',
                sommeliers_title: 'Sommeliers de la Casa',
                leblonzito_name: 'Leblonzito', leblonzito_quote: '"Curador de blancos ligeros."',
                ipanemita_name: 'Ipanemita', ipanemita_quote: '"Especialista en tintos de cuerpo."',
                btn_explore_countries: 'Explorar por países',
                error_loading: 'Datos no disponibles ahora.',
                no_origin: 'Ningún origen registrado todavía.',
                no_ratings: 'Sin valoraciones registradas todavía.'
            },
            catalogo: {
                title: 'Nuestra Bodega', subtitle: 'Todas las etiquetas que ya compartimos, con la nota de cada uno.',
                search_placeholder: 'Buscar vino, uva o país...',
                filter_all: 'Todos', filter_red: 'Tintos', filter_white: 'Blancos', filter_rose: 'Rosados', filter_sparkling: 'Espumosos',
                sort_label: 'Ordenar:', sort_recent: 'Más Recientes', sort_rating_desc: 'Mayor Nota', sort_rating_asc: 'Menor Nota', sort_az: 'A–Z',
                empty_title: 'Ningún vino encontrado', empty_text: 'Prueba otros términos o borra los filtros.', btn_clear: 'Borrar filtros',
                result_singular: 'vino', result_plural: 'vinos',
                error_title: 'Error al cargar la bodega', error_text: 'Intenta recargar la página.',
                grape_not_informed: 'Uva no informada', origin_not_informed: 'Origen no informado',
                special_label: 'Etiqueta Especial'
            },
            melhores: {
                title: 'Mejores del Mes', subtitle: 'Las etiquetas que más destacaron en cada período de nuestra bodega.',
                error: 'Error al cargar. Inténtalo de nuevo.',
                special_wine: 'Vino Especial', grape_not_informed: 'Uva no informada', origin_not_informed: 'Origen no informado',
                see_first: 'Ver 1.º elegido', see_second: 'Ver 2.º elegido', default_label: 'Destacado'
            },
            paises: {
                title: 'Mapa de la Bodega', subtitle: 'Nuestra colección organizada por origen y terruño.',
                error: 'Error al cargar el mapa. Inténtalo de nuevo.'
            },
            uvas: {
                title: 'Variedades de Uva', subtitle: 'La esencia de cada uva que ya pasó por nuestra mesa.',
                error: 'Error al cargar uvas. Inténtalo de nuevo.',
                btn_about: 'Sobre la uva', consulting: 'Consultando...', error_short: 'Error',
                no_description: 'Información no disponible.'
            },
            vinicolas: {
                title: 'Bodegas y Productores', subtitle: 'Cada botella tiene una firma detrás.',
                search_placeholder: 'Buscar bodega o productor...',
                error: 'No pudimos cargar las bodegas.\nInténtalo de nuevo más tarde.',
                empty: 'No se encontró ninguna bodega para esa búsqueda.',
                unknown_producer: 'Productor Desconocido'
            },
            games: {
                title: 'Sala de Juegos', subtitle: 'Desafíos creados a partir de los vinos que ya registramos.',
                score_label: 'Copas de Oro:', preparing: 'Preparando las copas...',
                badge_sheet: 'Planilla', badge_puzzle: 'Puzzle',
                card1_title: 'Maestro del Terruño', card1_desc: '¿De qué país es esta etiqueta?',
                card2_title: 'Cata a Ciegas', card2_desc: '¿Qué uva compone este vino?',
                card3_title: 'Duelo de Paladares', card3_desc: '¿Quién le dio la nota más alta a este vino?',
                card4_title: 'Ahorcado del Vino', card4_desc: 'Descubre la palabra del mundo del vino.',
                btn_back: 'Volver', dyn_title_placeholder: 'Título', dyn_name_placeholder: 'Nombre del Vino',
                dyn_question_placeholder: '¿Pregunta?', consumed_on: 'Consumido el:',
                btn_next_round: 'Siguiente Ronda', btn_new_word: 'Nueva Palabra',
                errors_label: 'Errores:',
                few_wines: '¡Hay pocos vinos en la bodega para jugar!',
                quiz_pais_title: 'Maestro del Terruño', quiz_pais_question: '¿De qué país es este vino?',
                quiz_uva_title: 'Cata a Ciegas', quiz_uva_question: '¿Cuál es la uva principal de esta etiqueta?',
                quiz_duelo_title: 'Duelo de Paladares', quiz_duelo_question: '¿Quién le dio la nota más alta a este vino?',
                correct_pais: '¡Correcto! +10 Copas 🏆', wrong_pais: '¡Incorrecto! Era de {val}',
                correct_uva: '¡Exacto! +10 Copas 🍇', wrong_uva: 'En realidad era {val}',
                duelo_tie: 'Notas Iguales (Empate)', duelo_correct: '¡Correcto! {msg}', duelo_wrong: '¡Incorrecto! {msg}',
                hang_saved: '¡Salvaste el vino! +20 Copas 🍷', hang_broke: '¡La botella se rompió! La palabra era {word}.',
                letter_aria: 'Letra {letter}', date_not_informed: 'Fecha no informada'
            },
            stats: {
                title: 'Estadísticas de la Bodega', subtitle: 'Los números detrás de cada trago que registramos.',
                filter_all_time: 'Toda la bodega',
                hero_default: 'Retrato de la bodega', hero_period: 'Retrato de {periodo}',
                hero_unit_singular: 'etiqueta registrada', hero_unit_plural: 'etiquetas registradas',
                hero_none: 'Ninguna etiqueta registrada en este período.',
                hero_phrase: 'Nuestra bodega recorre {paises} y {castas} diferentes.{origem}{casta}.',
                hero_top_origin: ' El origen que más vuelve a la mesa es {val}',
                hero_top_grape: ', y la uva preferida es {val}',
                mini_avg: 'Nota media', mini_countries: 'Países', mini_grapes: 'Uvas', mini_rated: 'Evaluados',
                podium_title: 'Podio de las etiquetas', podium_empty: 'Ninguna valoración en este período.',
                card_wines: 'Vinos en la bodega', card_avg: 'Media general', card_avg_sub: 'de {n} evaluados',
                card_top_country: 'País favorito', card_top_grape: 'Uva favorita', card_top_type: 'Estilo predilecto',
                card_top_rating: 'Nota más alta',
                chart_countries: 'Distribución por país', chart_grapes: 'Top 10 variedades de uva',
                chart_time: 'Evolución a lo largo del tiempo', chart_types: 'Estilos en la copa',
                chart_ratings: 'Cómo evaluamos', chart_duel: 'Fellype vs Hwlly',
                empty_countries: 'Sin orígenes registrados en este período.', empty_grapes: 'Sin uvas registradas en este período.',
                empty_time: 'Sin fechas de consumo registradas todavía.', empty_types: 'Estilos aún no clasificados en la planilla.',
                empty_ratings: 'Ninguna nota registrada en este período.', empty_duel: 'Valoraciones dobles aún no registradas.',
                insight_country_share: '{pais} representa el {pct}% de la bodega',
                insight_time_peak: 'Período más generoso: {periodo} con {n}',
                insight_type_share: 'Los {tipo} son el {pct}% de lo que abrimos',
                insight_ratings_range: 'La mayoría de nuestros vinos están entre {faixa}',
                insight_duel_tie: 'Notas prácticamente idénticas — coincidimos en el {pct}% de las etiquetas',
                insight_duel_diff: '{quem} da +{diff} más que {outro} · coincidimos en el {pct}%',
                error_title: 'No pudimos cargar las estadísticas ahora.', btn_retry: 'Intentar de nuevo',
                axis_fellype: 'Nota Fellype', axis_hwlly: 'Nota Hwlly',
                range_under6: 'hasta 5,9', range_6to7: '6 – 6,9', range_7to8: '7 – 7,9', range_8to9: '8 – 8,9', range_9to10: '9 – 10',
                range_and: ' y ', filter_period_aria: 'Filtrar por período', no_name: 'Sin nombre', grape_unidentified: 'No identificada'
            },
            cadastro: {
                dialog_title: 'Valoración Final', label_rating_fellype: 'Nota Fellype', label_rating_hwlly: 'Nota Hwlly',
                label_would_buy: '¿Lo volverías a comprar?', opt_yes: 'Sí', opt_no: 'No',
                label_date: 'Fecha de Consumo', label_photo: 'Foto del Brindis', btn_select_photo: 'Seleccionar o Tomar Foto',
                photo_preview_alt: 'Vista previa de la foto', btn_finish: 'Finalizar Brindis 🍷', btn_finishing: 'Eternizando Recuerdo...',
                input_placeholder: 'Envía un mensaje...', send_aria: 'Enviar', answer_aria: 'Tu respuesta',
                undo_btn: '↩ Corregir última respuesta', undo_title: 'Corregir última respuesta',
                greeting: '¡Hola! Soy Leblonzito. ¿Registramos ese brindis? ',
                skip_hint: 'Presiona Enter para saltar...', skip_manual: 'Completar manualmente →',
                q_wine_name: '¿Cuál es el nombre de la etiqueta?', q_producer: '¿Quién es el productor o bodega?',
                q_classification: '¿Cuál es la clasificación? (Ej: Reserva, Blend...)', q_grape: '¿Cuáles son las uvas principales?',
                q_type: '¿Cuál es el tipo? (Tinto, Blanco, Rosado...)', q_year: '¿Cuál es la añada (año)?',
                q_country: '¿De qué país es?', q_region: '¿Cuál es la región?', q_abv: '¿Cuál es la graduación alcohólica?',
                q_password: 'Ahora la contraseña de acceso para guardar:',
                sommelier_online: 'Sommelier En Línea', smart_curation: 'Curaduría Inteligente',
                select_confirm_label: 'Selecciona los datos que deseas confirmar:', btn_confirm_selected: '✓ Confirmar seleccionados',
                found_data: '{emoji} ¡Encontré algunos datos sobre este vino!\n\n{lista}\n\n¿Completamos lo que falta?',
                all_filled: '{emoji} ¡Todo completado por la IA!\n\n{lista}',
                autofilling: '{emoji} Completando automáticamente:\n\n{lista}',
                validating: 'Validando acceso...', access_granted: '¡Acceso autorizado! Hora de calificar y finalizar el brindis. 🍷',
                wrong_password: 'Contraseña incorrecta. Inténtalo de nuevo:',
                toast_success: '🍷 ¡Brindis eternizado con éxito!\n\nEl vino se añadió a nuestra bodega. Redirigiendo al catálogo...',
                toast_success_fallback: '✅ ¡Brindis registrado! Redirigiendo...',
                field_producer: 'Productor', field_country: 'País', field_region: 'Región', field_grape: 'Uva',
                field_type: 'Tipo', field_year: 'Añada', field_abv: 'Graduación', field_classification: 'Clasificación',
                not_informed: 'No informado', last_hint: 'Último: {val}',
                safra_label: 'Añada {val}'
            },
            common: {
                loading: 'Cargando...',
                wine_no_name: 'Vino s/ Nombre', grape_no_info: 'Uva s/ info', grape_unidentified: 'No identificada',
                view_details: 'Ver detalles de {nome}', flag_of: 'Bandera de {pais}',
                main_nav_aria: 'Navegación principal', back_to_top: 'Volver arriba'
            }
        },

        it: {
            nav: {
                home: 'Home', catalog: 'Catalogo', best: 'Del Mese', games: 'Giochi',
                explore: 'Esplora', countries: 'Per paese', grapes: 'Per vitigno',
                wineries: 'Cantine', stats: 'Statistiche', register: 'Registra',
                skip: 'Vai al contenuto', open_menu: 'Apri menu',
                home_aria: 'Fellype & Hwlly — pagina iniziale', tagline: 'Cantina personale'
            },
            footer: {
                tagline: 'Fatto con ❤️ per i nostri ricordi.',
                curation: 'A cura di Leblonzito & Ipanemita'
            },
            modal: {
                close: 'Chiudi dettagli', country: 'Paese', region: 'Regione', grapes: 'Vitigno/i',
                type: 'Tipo', vintage: 'Annata', abv: 'Gradazione alcolica', classification: 'Classificazione',
                tasted_on: 'Degustato il', special_label: 'Etichetta speciale',
                wine_photo: 'Foto del vino', label_prefix: 'Etichetta: '
            },
            switcher: { label: 'Lingua' },
            index: {
                hero_eyebrow: 'Cantina personale',
                hero_quote: '"Questo angolo è solo nostro: un ricordo affettuoso di ogni calice, ogni viaggio e ogni storia vissuta insieme nel mondo del vino."',
                hero_intro: 'Dal primo brindisi, conserviamo qui ogni etichetta, ogni nota e ogni ricordo, organizzati per paese, vitigno e cantina.',
                btn_explore_catalog: 'Esplora il catalogo', btn_best_of_month: 'Migliori del mese',
                stats_eyebrow: 'La nostra cantina in numeri', stats_title: 'Il ritratto di tutto ciò che abbiamo brindato',
                stats_sub: 'Ogni etichetta registrata è diventata un dato: origini, vitigni, voti e l’evoluzione mese dopo mese.',
                stat_wines: 'Vini Degustati', stat_countries: 'Paesi Esplorati',
                stat_grapes: 'Vitigni Unici', stat_avg: 'Voto Medio',
                panel_top_origins: 'Origini più visitate', panel_top_wine: 'Etichetta più apprezzata',
                cta_full_stats: 'Vedi l’analisi completa della cantina',
                journey_title: 'Il Nostro Viaggio Sensoriale',
                journey_intro: 'Ogni bottiglia aperta è una nuova pagina scritta. Da cantine storiche a piccoli produttori, la nostra cantina digitale riflette la nostra evoluzione e passione condivisa.',
                exp_terroir_title: 'Terroir Preferiti', exp_terroir_text: 'Dal Portogallo all’Uruguay, passando per Mendoza e le colline di Lisbona.',
                exp_grapes_title: 'Vitigni Preferiti', exp_grapes_text: 'La freschezza dello Chardonnay, l’intensità della Syrah e la complessità dei blend italiani.',
                exp_labels_title: 'Etichette in Evidenza', exp_labels_text: 'Esperienze memorabili con Parras Wine, Undurraga e tesori scovati.',
                exp_time_title: 'Capsula del Tempo', exp_time_text: 'Qui ogni calice è un ricordo pronto per essere rivissuto, brindisi dopo brindisi.',
                sommeliers_title: 'I Sommelier di Casa',
                leblonzito_name: 'Leblonzito', leblonzito_quote: '"Curatore di bianchi leggeri."',
                ipanemita_name: 'Ipanemita', ipanemita_quote: '"Specialista in rossi corposi."',
                btn_explore_countries: 'Esplora per paese',
                error_loading: 'Dati non disponibili al momento.',
                no_origin: 'Nessuna origine registrata ancora.',
                no_ratings: 'Nessuna valutazione registrata ancora.'
            },
            catalogo: {
                title: 'La Nostra Cantina', subtitle: 'Tutte le etichette che abbiamo condiviso, con il voto di ciascuno di noi.',
                search_placeholder: 'Cerca vino, vitigno o paese...',
                filter_all: 'Tutti', filter_red: 'Rossi', filter_white: 'Bianchi', filter_rose: 'Rosé', filter_sparkling: 'Spumanti',
                sort_label: 'Ordina:', sort_recent: 'Più Recenti', sort_rating_desc: 'Voto Più Alto', sort_rating_asc: 'Voto Più Basso', sort_az: 'A–Z',
                empty_title: 'Nessun vino trovato', empty_text: 'Prova altri termini o rimuovi i filtri.', btn_clear: 'Rimuovi filtri',
                result_singular: 'vino', result_plural: 'vini',
                error_title: 'Errore nel caricamento della cantina', error_text: 'Prova a ricaricare la pagina.',
                grape_not_informed: 'Vitigno non indicato', origin_not_informed: 'Origine non indicata',
                special_label: 'Etichetta Speciale'
            },
            melhores: {
                title: 'Migliori del Mese', subtitle: 'Le etichette che hanno segnato ogni periodo della nostra cantina.',
                error: 'Errore nel caricamento. Riprova.',
                special_wine: 'Vino Speciale', grape_not_informed: 'Vitigno non indicato', origin_not_informed: 'Origine non indicata',
                see_first: 'Vedi 1° scelto', see_second: 'Vedi 2° scelto', default_label: 'In evidenza'
            },
            paises: {
                title: 'Mappa della Cantina', subtitle: 'La nostra collezione organizzata per origine e terroir.',
                error: 'Errore nel caricamento della mappa. Riprova.'
            },
            uvas: {
                title: 'Varietà di Uve', subtitle: 'L’essenza di ogni vitigno passato sulla nostra tavola.',
                error: 'Errore nel caricamento dei vitigni. Riprova.',
                btn_about: 'Info sul vitigno', consulting: 'Consultazione in corso...', error_short: 'Errore',
                no_description: 'Informazione non disponibile.'
            },
            vinicolas: {
                title: 'Cantine & Produttori', subtitle: 'Ogni bottiglia ha una firma dietro di sé.',
                search_placeholder: 'Cerca cantina o produttore...',
                error: 'Non è stato possibile caricare le cantine.\nRiprova più tardi.',
                empty: 'Nessuna cantina trovata per questa ricerca.',
                unknown_producer: 'Produttore Sconosciuto'
            },
            games: {
                title: 'Sala Giochi', subtitle: 'Sfide create a partire dai vini già registrati.',
                score_label: 'Coppe d’Oro:', preparing: 'Preparazione dei calici...',
                badge_sheet: 'Foglio', badge_puzzle: 'Puzzle',
                card1_title: 'Maestro del Terroir', card1_desc: 'Da quale paese proviene questa etichetta?',
                card2_title: 'Degustazione alla Cieca', card2_desc: 'Quale vitigno compone questo vino?',
                card3_title: 'Duello dei Palati', card3_desc: 'Chi ha dato il voto più alto a questo vino?',
                card4_title: 'Impiccato Enologico', card4_desc: 'Scopri la parola dal mondo del vino.',
                btn_back: 'Indietro', dyn_title_placeholder: 'Titolo', dyn_name_placeholder: 'Nome del Vino',
                dyn_question_placeholder: 'Domanda?', consumed_on: 'Consumato il:',
                btn_next_round: 'Prossimo Turno', btn_new_word: 'Nuova Parola',
                errors_label: 'Errori:',
                few_wines: 'Troppi pochi vini in cantina per giocare!',
                quiz_pais_title: 'Maestro del Terroir', quiz_pais_question: 'Da quale paese proviene questo vino?',
                quiz_uva_title: 'Degustazione alla Cieca', quiz_uva_question: 'Qual è il vitigno principale di questa etichetta?',
                quiz_duelo_title: 'Duello dei Palati', quiz_duelo_question: 'Chi ha dato il voto più alto a questo vino?',
                correct_pais: 'Esatto! +10 Coppe 🏆', wrong_pais: 'Sbagliato! Era di {val}',
                correct_uva: 'Esatto! +10 Coppe 🍇', wrong_uva: 'In realtà era {val}',
                duelo_tie: 'Voti Uguali (Pareggio)', duelo_correct: 'Esatto! {msg}', duelo_wrong: 'Sbagliato! {msg}',
                hang_saved: 'Hai salvato il vino! +20 Coppe 🍷', hang_broke: 'La bottiglia si è rotta! La parola era {word}.',
                letter_aria: 'Lettera {letter}', date_not_informed: 'Data non indicata'
            },
            stats: {
                title: 'Statistiche della Cantina', subtitle: 'I numeri dietro ogni sorso registrato.',
                filter_all_time: 'Tutta la cantina',
                hero_default: 'Ritratto della cantina', hero_period: 'Ritratto di {periodo}',
                hero_unit_singular: 'etichetta registrata', hero_unit_plural: 'etichette registrate',
                hero_none: 'Nessuna etichetta registrata in questo periodo.',
                hero_phrase: 'La nostra cantina attraversa {paises} e {castas} diversi.{origem}{casta}.',
                hero_top_origin: ' L’origine che torna più spesso in tavola è {val}',
                hero_top_grape: ', e il vitigno preferito è {val}',
                mini_avg: 'Voto medio', mini_countries: 'Paesi', mini_grapes: 'Vitigni', mini_rated: 'Valutati',
                podium_title: 'Podio delle etichette', podium_empty: 'Nessuna valutazione in questo periodo.',
                card_wines: 'Vini in cantina', card_avg: 'Media generale', card_avg_sub: 'su {n} valutati',
                card_top_country: 'Paese preferito', card_top_grape: 'Vitigno preferito', card_top_type: 'Stile preferito',
                card_top_rating: 'Voto più alto',
                chart_countries: 'Distribuzione per paese', chart_grapes: 'Top 10 varietà di uva',
                chart_time: 'Evoluzione nel tempo', chart_types: 'Stili nel calice',
                chart_ratings: 'Come valutiamo', chart_duel: 'Fellype vs Hwlly',
                empty_countries: 'Nessuna origine registrata in questo periodo.', empty_grapes: 'Nessun vitigno registrato in questo periodo.',
                empty_time: 'Nessuna data di consumo ancora registrata.', empty_types: 'Stili non ancora classificati nel foglio.',
                empty_ratings: 'Nessun voto registrato in questo periodo.', empty_duel: 'Valutazioni doppie non ancora registrate.',
                insight_country_share: '{pais} rappresenta il {pct}% della cantina',
                insight_time_peak: 'Periodo più generoso: {periodo} con {n}',
                insight_type_share: 'I {tipo} sono il {pct}% di ciò che apriamo',
                insight_ratings_range: 'La maggior parte dei nostri vini si colloca tra {faixa}',
                insight_duel_tie: 'Voti quasi identici — siamo d’accordo sul {pct}% delle etichette',
                insight_duel_diff: '{quem} dà +{diff} in più di {outro} · siamo d’accordo sul {pct}%',
                error_title: 'Al momento non riusciamo a caricare le statistiche.', btn_retry: 'Riprova',
                axis_fellype: 'Voto Fellype', axis_hwlly: 'Voto Hwlly',
                range_under6: 'fino a 5,9', range_6to7: '6 – 6,9', range_7to8: '7 – 7,9', range_8to9: '8 – 8,9', range_9to10: '9 – 10',
                range_and: ' e ', filter_period_aria: 'Filtra per periodo', no_name: 'Senza nome', grape_unidentified: 'Non identificato'
            },
            cadastro: {
                dialog_title: 'Valutazione Finale', label_rating_fellype: 'Voto Fellype', label_rating_hwlly: 'Voto Hwlly',
                label_would_buy: 'Lo ricompreresti?', opt_yes: 'Sì', opt_no: 'No',
                label_date: 'Data di Consumo', label_photo: 'Foto del Brindisi', btn_select_photo: 'Seleziona o Scatta Foto',
                photo_preview_alt: 'Anteprima foto', btn_finish: 'Concludi Brindisi 🍷', btn_finishing: 'Ricordo in corso...',
                input_placeholder: 'Invia un messaggio...', send_aria: 'Invia', answer_aria: 'La tua risposta',
                undo_btn: '↩ Correggi ultima risposta', undo_title: 'Correggi ultima risposta',
                greeting: 'Ciao! Sono Leblonzito. Registriamo questo brindisi? ',
                skip_hint: 'Premi Invio per saltare...', skip_manual: 'Compila manualmente →',
                q_wine_name: 'Qual è il nome dell’etichetta?', q_producer: 'Chi è il produttore o la cantina?',
                q_classification: 'Qual è la classificazione? (Es: Riserva, Blend...)', q_grape: 'Quali sono i vitigni principali?',
                q_type: 'Qual è il tipo? (Rosso, Bianco, Rosé...)', q_year: 'Qual è l’annata?',
                q_country: 'Da quale paese proviene?', q_region: 'Qual è la regione?', q_abv: 'Qual è la gradazione alcolica?',
                q_password: 'Ora la password di accesso per salvare:',
                sommelier_online: 'Sommelier Online', smart_curation: 'Curatela Intelligente',
                select_confirm_label: 'Seleziona i dati che vuoi confermare:', btn_confirm_selected: '✓ Conferma selezionati',
                found_data: '{emoji} Ho trovato alcuni dati su questo vino!\n\n{lista}\n\nCompiliamo ciò che manca?',
                all_filled: '{emoji} Tutto compilato dall’IA!\n\n{lista}',
                autofilling: '{emoji} Compilazione automatica:\n\n{lista}',
                validating: 'Verifica accesso...', access_granted: 'Accesso autorizzato! È ora di votare e concludere il brindisi. 🍷',
                wrong_password: 'Password errata. Riprova:',
                toast_success: '🍷 Brindisi immortalato con successo!\n\nIl vino è stato aggiunto alla nostra cantina. Reindirizzamento al catalogo...',
                toast_success_fallback: '✅ Brindisi registrato! Reindirizzamento...',
                field_producer: 'Produttore', field_country: 'Paese', field_region: 'Regione', field_grape: 'Vitigno',
                field_type: 'Tipo', field_year: 'Annata', field_abv: 'Gradazione', field_classification: 'Classificazione',
                not_informed: 'Non indicato', last_hint: 'Ultimo: {val}',
                safra_label: 'Annata {val}'
            },
            common: {
                loading: 'Caricamento...',
                wine_no_name: 'Vino s/ Nome', grape_no_info: 'Vitigno s/ info', grape_unidentified: 'Non identificato',
                view_details: 'Vedi dettagli di {nome}', flag_of: 'Bandiera di {pais}',
                main_nav_aria: 'Navigazione principale', back_to_top: 'Torna su'
            }
        },

        fr: {
            nav: {
                home: 'Accueil', catalog: 'Catalogue', best: 'Du Mois', games: 'Jeux',
                explore: 'Explorer', countries: 'Par pays', grapes: 'Par cépage',
                wineries: 'Domaines viticoles', stats: 'Statistiques', register: 'Enregistrer',
                skip: 'Aller au contenu', open_menu: 'Ouvrir le menu',
                home_aria: 'Fellype & Hwlly — page d’accueil', tagline: 'Cave personnelle'
            },
            footer: {
                tagline: 'Fait avec ❤️ pour nos souvenirs.',
                curation: 'Sélection de Leblonzito & Ipanemita'
            },
            modal: {
                close: 'Fermer les détails', country: 'Pays', region: 'Région', grapes: 'Cépage(s)',
                type: 'Type', vintage: 'Millésime', abv: 'Degré d’alcool', classification: 'Classification',
                tasted_on: 'Dégusté le', special_label: 'Étiquette spéciale',
                wine_photo: 'Photo du vin', label_prefix: 'Étiquette : '
            },
            switcher: { label: 'Langue' },
            index: {
                hero_eyebrow: 'Cave personnelle',
                hero_quote: '"Ce petit coin est bien à nous : un souvenir affectueux de chaque verre, chaque voyage et chaque histoire vécue ensemble dans l’univers du vin."',
                hero_intro: 'Depuis notre premier toast, nous gardons ici chaque étiquette, chaque note et chaque souvenir, organisés par pays, cépage et domaine.',
                btn_explore_catalog: 'Explorer le catalogue', btn_best_of_month: 'Meilleurs du mois',
                stats_eyebrow: 'Notre cave en chiffres', stats_title: 'Le portrait de tout ce que nous avons célébré',
                stats_sub: 'Chaque étiquette enregistrée est devenue une donnée : origines, cépages, notes et évolution mois après mois.',
                stat_wines: 'Vins Dégustés', stat_countries: 'Pays Explorés',
                stat_grapes: 'Cépages Uniques', stat_avg: 'Note Moyenne',
                panel_top_origins: 'Origines les plus visitées', panel_top_wine: 'Étiquette la mieux notée',
                cta_full_stats: 'Voir l’analyse complète de la cave',
                journey_title: 'Notre Voyage Sensoriel',
                journey_intro: 'Chaque bouteille ouverte est une nouvelle page écrite. Des domaines historiques aux petits producteurs, notre cave numérique reflète notre évolution et notre passion partagée.',
                exp_terroir_title: 'Terroirs Favoris', exp_terroir_text: 'Du Portugal à l’Uruguay, en passant par Mendoza et les collines de Lisbonne.',
                exp_grapes_title: 'Cépages Favoris', exp_grapes_text: 'La fraîcheur du Chardonnay, l’intensité de la Syrah et la complexité des assemblages italiens.',
                exp_labels_title: 'Étiquettes en Vedette', exp_labels_text: 'Des expériences mémorables avec Parras Wine, Undurraga et des trésors dénichés.',
                exp_time_title: 'Capsule Temporelle', exp_time_text: 'Ici, chaque verre est un souvenir prêt à être revisité, toast après toast.',
                sommeliers_title: 'Les Sommeliers de la Maison',
                leblonzito_name: 'Leblonzito', leblonzito_quote: '"Curateur de blancs légers."',
                ipanemita_name: 'Ipanemita', ipanemita_quote: '"Spécialiste des rouges corsés."',
                btn_explore_countries: 'Explorer par pays',
                error_loading: 'Données indisponibles pour le moment.',
                no_origin: 'Aucune origine enregistrée pour l’instant.',
                no_ratings: 'Aucune évaluation enregistrée pour l’instant.'
            },
            catalogo: {
                title: 'Notre Cave', subtitle: 'Toutes les étiquettes que nous avons partagées, avec la note de chacun de nous.',
                search_placeholder: 'Rechercher un vin, un cépage ou un pays...',
                filter_all: 'Tous', filter_red: 'Rouges', filter_white: 'Blancs', filter_rose: 'Rosés', filter_sparkling: 'Effervescents',
                sort_label: 'Trier :', sort_recent: 'Plus Récents', sort_rating_desc: 'Meilleure Note', sort_rating_asc: 'Note la Plus Basse', sort_az: 'A–Z',
                empty_title: 'Aucun vin trouvé', empty_text: 'Essayez d’autres termes ou effacez les filtres.', btn_clear: 'Effacer les filtres',
                result_singular: 'vin', result_plural: 'vins',
                error_title: 'Erreur lors du chargement de la cave', error_text: 'Essayez de recharger la page.',
                grape_not_informed: 'Cépage non renseigné', origin_not_informed: 'Origine non renseignée',
                special_label: 'Étiquette Spéciale'
            },
            melhores: {
                title: 'Meilleurs du Mois', subtitle: 'Les étiquettes qui ont marqué chaque période de notre cave.',
                error: 'Erreur de chargement. Veuillez réessayer.',
                special_wine: 'Vin Spécial', grape_not_informed: 'Cépage non renseigné', origin_not_informed: 'Origine non renseignée',
                see_first: 'Voir le 1er choix', see_second: 'Voir le 2e choix', default_label: 'À l’honneur'
            },
            paises: {
                title: 'Carte de la Cave', subtitle: 'Notre collection organisée par origine et terroir.',
                error: 'Erreur lors du chargement de la carte. Veuillez réessayer.'
            },
            uvas: {
                title: 'Variétés de Cépages', subtitle: 'L’essence de chaque cépage passé sur notre table.',
                error: 'Erreur lors du chargement des cépages. Veuillez réessayer.',
                btn_about: 'À propos du cépage', consulting: 'Consultation en cours...', error_short: 'Erreur',
                no_description: 'Information non disponible.'
            },
            vinicolas: {
                title: 'Domaines & Producteurs', subtitle: 'Chaque bouteille a une signature derrière elle.',
                search_placeholder: 'Rechercher un domaine ou un producteur...',
                error: 'Impossible de charger les domaines.\nVeuillez réessayer plus tard.',
                empty: 'Aucun domaine trouvé pour cette recherche.',
                unknown_producer: 'Producteur Inconnu'
            },
            games: {
                title: 'Salon de Jeux', subtitle: 'Des défis créés à partir des vins déjà enregistrés.',
                score_label: 'Coupes d’Or :', preparing: 'Préparation des coupes...',
                badge_sheet: 'Feuille', badge_puzzle: 'Puzzle',
                card1_title: 'Maître du Terroir', card1_desc: 'De quel pays vient cette étiquette ?',
                card2_title: 'Dégustation à l’Aveugle', card2_desc: 'Quel cépage compose ce vin ?',
                card3_title: 'Duel des Palais', card3_desc: 'Qui a donné la meilleure note à ce vin ?',
                card4_title: 'Pendu Œnologique', card4_desc: 'Devinez le mot du monde du vin.',
                btn_back: 'Retour', dyn_title_placeholder: 'Titre', dyn_name_placeholder: 'Nom du Vin',
                dyn_question_placeholder: 'Question ?', consumed_on: 'Dégusté le :',
                btn_next_round: 'Manche Suivante', btn_new_word: 'Nouveau Mot',
                errors_label: 'Erreurs :',
                few_wines: 'Pas assez de vins dans la cave pour jouer !',
                quiz_pais_title: 'Maître du Terroir', quiz_pais_question: 'De quel pays vient ce vin ?',
                quiz_uva_title: 'Dégustation à l’Aveugle', quiz_uva_question: 'Quel est le cépage principal de cette étiquette ?',
                quiz_duelo_title: 'Duel des Palais', quiz_duelo_question: 'Qui a donné la meilleure note à ce vin ?',
                correct_pais: 'Correct ! +10 Coupes 🏆', wrong_pais: 'Faux ! C’était {val}',
                correct_uva: 'Exact ! +10 Coupes 🍇', wrong_uva: 'En fait c’était {val}',
                duelo_tie: 'Notes Égales (Égalité)', duelo_correct: 'Correct ! {msg}', duelo_wrong: 'Faux ! {msg}',
                hang_saved: 'Vous avez sauvé le vin ! +20 Coupes 🍷', hang_broke: 'La bouteille s’est cassée ! Le mot était {word}.',
                letter_aria: 'Lettre {letter}', date_not_informed: 'Date non renseignée'
            },
            stats: {
                title: 'Statistiques de la Cave', subtitle: 'Les chiffres derrière chaque gorgée enregistrée.',
                filter_all_time: 'Toute la cave',
                hero_default: 'Portrait de la cave', hero_period: 'Portrait de {periodo}',
                hero_unit_singular: 'étiquette enregistrée', hero_unit_plural: 'étiquettes enregistrées',
                hero_none: 'Aucune étiquette enregistrée sur cette période.',
                hero_phrase: 'Notre cave parcourt {paises} et {castas} différents.{origem}{casta}.',
                hero_top_origin: ' L’origine qui revient le plus souvent sur la table est {val}',
                hero_top_grape: ', et le cépage préféré est {val}',
                mini_avg: 'Note moyenne', mini_countries: 'Pays', mini_grapes: 'Cépages', mini_rated: 'Notés',
                podium_title: 'Podium des étiquettes', podium_empty: 'Aucune évaluation sur cette période.',
                card_wines: 'Vins dans la cave', card_avg: 'Moyenne générale', card_avg_sub: 'sur {n} notés',
                card_top_country: 'Pays favori', card_top_grape: 'Cépage favori', card_top_type: 'Style préféré',
                card_top_rating: 'Meilleure note',
                chart_countries: 'Répartition par pays', chart_grapes: 'Top 10 des cépages',
                chart_time: 'Évolution dans le temps', chart_types: 'Styles dans le verre',
                chart_ratings: 'Comment nous notons', chart_duel: 'Fellype vs Hwlly',
                empty_countries: 'Aucune origine enregistrée sur cette période.', empty_grapes: 'Aucun cépage enregistré sur cette période.',
                empty_time: 'Aucune date de dégustation encore enregistrée.', empty_types: 'Styles pas encore classés dans le tableur.',
                empty_ratings: 'Aucune note enregistrée sur cette période.', empty_duel: 'Évaluations doubles pas encore enregistrées.',
                insight_country_share: '{pais} représente {pct}% de la cave',
                insight_time_peak: 'Période la plus généreuse : {periodo} avec {n}',
                insight_type_share: 'Les {tipo} représentent {pct}% de ce que nous ouvrons',
                insight_ratings_range: 'La plupart de nos vins se situent entre {faixa}',
                insight_duel_tie: 'Notes presque identiques — nous sommes d’accord sur {pct}% des étiquettes',
                insight_duel_diff: '{quem} note +{diff} de plus que {outro} · nous sommes d’accord sur {pct}%',
                error_title: 'Impossible de charger les statistiques pour le moment.', btn_retry: 'Réessayer',
                axis_fellype: 'Note Fellype', axis_hwlly: 'Note Hwlly',
                range_under6: 'jusqu’à 5,9', range_6to7: '6 – 6,9', range_7to8: '7 – 7,9', range_8to9: '8 – 8,9', range_9to10: '9 – 10',
                range_and: ' et ', filter_period_aria: 'Filtrer par période', no_name: 'Sans nom', grape_unidentified: 'Non identifié'
            },
            cadastro: {
                dialog_title: 'Évaluation Finale', label_rating_fellype: 'Note Fellype', label_rating_hwlly: 'Note Hwlly',
                label_would_buy: 'Le rachèteriez-vous ?', opt_yes: 'Oui', opt_no: 'Non',
                label_date: 'Date de Dégustation', label_photo: 'Photo du Toast', btn_select_photo: 'Choisir ou Prendre une Photo',
                photo_preview_alt: 'Aperçu de la photo', btn_finish: 'Terminer le Toast 🍷', btn_finishing: 'Immortalisation du Souvenir...',
                input_placeholder: 'Envoyer un message...', send_aria: 'Envoyer', answer_aria: 'Votre réponse',
                undo_btn: '↩ Corriger la dernière réponse', undo_title: 'Corriger la dernière réponse',
                greeting: 'Bonjour ! Je suis Leblonzito. On enregistre ce toast ? ',
                skip_hint: 'Appuyez sur Entrée pour passer...', skip_manual: 'Remplir manuellement →',
                q_wine_name: 'Quel est le nom de l’étiquette ?', q_producer: 'Qui est le producteur ou le domaine ?',
                q_classification: 'Quelle est la classification ? (Ex : Réserve, Assemblage...)', q_grape: 'Quels sont les cépages principaux ?',
                q_type: 'Quel est le type ? (Rouge, Blanc, Rosé...)', q_year: 'Quel est le millésime (année) ?',
                q_country: 'De quel pays vient-il ?', q_region: 'Quelle est la région ?', q_abv: 'Quel est le degré d’alcool ?',
                q_password: 'Maintenant le mot de passe d’accès pour enregistrer :',
                sommelier_online: 'Sommelier en Ligne', smart_curation: 'Curation Intelligente',
                select_confirm_label: 'Sélectionnez les données à confirmer :', btn_confirm_selected: '✓ Confirmer la sélection',
                found_data: '{emoji} J’ai trouvé des informations sur ce vin !\n\n{lista}\n\nOn complète ce qui manque ?',
                all_filled: '{emoji} Tout a été rempli par l’IA !\n\n{lista}',
                autofilling: '{emoji} Remplissage automatique :\n\n{lista}',
                validating: 'Vérification de l’accès...', access_granted: 'Accès autorisé ! Il est temps de noter et de terminer le toast. 🍷',
                wrong_password: 'Mot de passe incorrect. Réessayez :',
                toast_success: '🍷 Toast immortalisé avec succès !\n\nLe vin a été ajouté à notre cave. Redirection vers le catalogue...',
                toast_success_fallback: '✅ Toast enregistré ! Redirection...',
                field_producer: 'Producteur', field_country: 'Pays', field_region: 'Région', field_grape: 'Cépage',
                field_type: 'Type', field_year: 'Millésime', field_abv: 'Degré', field_classification: 'Classification',
                not_informed: 'Non renseigné', last_hint: 'Dernier : {val}',
                safra_label: 'Millésime {val}'
            },
            common: {
                loading: 'Chargement...',
                wine_no_name: 'Vin s/ Nom', grape_no_info: 'Cépage s/ info', grape_unidentified: 'Non identifié',
                view_details: 'Voir les détails de {nome}', flag_of: 'Drapeau de {pais}',
                main_nav_aria: 'Navigation principale', back_to_top: 'Retour en haut'
            }
        }
    };

    /* ============================================================
       DICIONÁRIOS DE DADOS DINÂMICOS (planilha)
       ============================================================ */
    var PAIS_DICT = {
        // chave normalizada (sem acento, minúscula) -> { pt (nome de exibição canônico), en, es, it, fr }
        'franca':          { pt: 'França', en: 'France', es: 'Francia', it: 'Francia', fr: 'France' },
        'italia':           { pt: 'Itália', en: 'Italy', es: 'Italia', it: 'Italia', fr: 'Italie' },
        'espanha':          { pt: 'Espanha', en: 'Spain', es: 'España', it: 'Spagna', fr: 'Espagne' },
        'portugal':         { pt: 'Portugal', en: 'Portugal', es: 'Portugal', it: 'Portogallo', fr: 'Portugal' },
        'chile':            { pt: 'Chile', en: 'Chile', es: 'Chile', it: 'Cile', fr: 'Chili' },
        'argentina':        { pt: 'Argentina', en: 'Argentina', es: 'Argentina', it: 'Argentina', fr: 'Argentine' },
        'estados unidos':   { pt: 'Estados Unidos', en: 'United States', es: 'Estados Unidos', it: 'Stati Uniti', fr: 'États-Unis' },
        'eua':              { pt: 'Estados Unidos', en: 'United States', es: 'Estados Unidos', it: 'Stati Uniti', fr: 'États-Unis' },
        'brasil':           { pt: 'Brasil', en: 'Brazil', es: 'Brasil', it: 'Brasile', fr: 'Brésil' },
        'alemanha':         { pt: 'Alemanha', en: 'Germany', es: 'Alemania', it: 'Germania', fr: 'Allemagne' },
        'austria':          { pt: 'Áustria', en: 'Austria', es: 'Austria', it: 'Austria', fr: 'Autriche' },
        'australia':        { pt: 'Austrália', en: 'Australia', es: 'Australia', it: 'Australia', fr: 'Australie' },
        'nova zelandia':    { pt: 'Nova Zelândia', en: 'New Zealand', es: 'Nueva Zelanda', it: 'Nuova Zelanda', fr: 'Nouvelle-Zélande' },
        'africa do sul':    { pt: 'África do Sul', en: 'South Africa', es: 'Sudáfrica', it: 'Sudafrica', fr: 'Afrique du Sud' },
        'uruguai':          { pt: 'Uruguai', en: 'Uruguay', es: 'Uruguay', it: 'Uruguay', fr: 'Uruguay' },
        'hungria':          { pt: 'Hungria', en: 'Hungary', es: 'Hungría', it: 'Ungheria', fr: 'Hongrie' },
        'grecia':           { pt: 'Grécia', en: 'Greece', es: 'Grecia', it: 'Grecia', fr: 'Grèce' },
        'georgia':          { pt: 'Geórgia', en: 'Georgia', es: 'Georgia', it: 'Georgia', fr: 'Géorgie' },
        'suica':            { pt: 'Suíça', en: 'Switzerland', es: 'Suiza', it: 'Svizzera', fr: 'Suisse' },
        'israel':           { pt: 'Israel', en: 'Israel', es: 'Israel', it: 'Israele', fr: 'Israël' },
        'libano':           { pt: 'Líbano', en: 'Lebanon', es: 'Líbano', it: 'Libano', fr: 'Liban' },
        'romenia':          { pt: 'Romênia', en: 'Romania', es: 'Rumanía', it: 'Romania', fr: 'Roumanie' },
        'bulgaria':         { pt: 'Bulgária', en: 'Bulgaria', es: 'Bulgaria', it: 'Bulgaria', fr: 'Bulgarie' },
        'croacia':          { pt: 'Croácia', en: 'Croatia', es: 'Croacia', it: 'Croazia', fr: 'Croatie' },
        'eslovenia':        { pt: 'Eslovênia', en: 'Slovenia', es: 'Eslovenia', it: 'Slovenia', fr: 'Slovénie' },
        'moldavia':         { pt: 'Moldávia', en: 'Moldova', es: 'Moldavia', it: 'Moldavia', fr: 'Moldavie' },
        'canada':           { pt: 'Canadá', en: 'Canada', es: 'Canadá', it: 'Canada', fr: 'Canada' },
        'inglaterra':       { pt: 'Reino Unido', en: 'United Kingdom', es: 'Reino Unido', it: 'Regno Unito', fr: 'Royaume-Uni' },
        'reino unido':      { pt: 'Reino Unido', en: 'United Kingdom', es: 'Reino Unido', it: 'Regno Unito', fr: 'Royaume-Uni' },
        'japao':            { pt: 'Japão', en: 'Japan', es: 'Japón', it: 'Giappone', fr: 'Japon' },
        'china':            { pt: 'China', en: 'China', es: 'China', it: 'Cina', fr: 'Chine' },
        'outros':           { pt: 'Outros', en: 'Other', es: 'Otros', it: 'Altri', fr: 'Autres' }
    };

    var TIPO_DICT = {
        'tinto':      { en: 'Red', es: 'Tinto', it: 'Rosso', fr: 'Rouge' },
        'branco':     { en: 'White', es: 'Blanco', it: 'Bianco', fr: 'Blanc' },
        'rose':       { en: 'Rosé', es: 'Rosado', it: 'Rosé', fr: 'Rosé' },
        'rosé':       { en: 'Rosé', es: 'Rosado', it: 'Rosé', fr: 'Rosé' },
        'espumante':  { en: 'Sparkling', es: 'Espumoso', it: 'Spumante', fr: 'Effervescent' },
        'sobremesa':  { en: 'Dessert', es: 'Postre', it: 'Dessert', fr: 'Dessert' },
        'doce':       { en: 'Sweet', es: 'Dulce', it: 'Dolce', fr: 'Doux' },
        'outros':     { en: 'Other', es: 'Otro', it: 'Altro', fr: 'Autre' }
    };

    var CLASSIFICACAO_DICT = {
        'seco':          { en: 'Dry', es: 'Seco', it: 'Secco', fr: 'Sec' },
        'meio seco':     { en: 'Off-Dry', es: 'Semiseco', it: 'Abboccato', fr: 'Demi-sec' },
        'frisante':      { en: 'Frizzante', es: 'Frisante', it: 'Frizzante', fr: 'Frizzante' },
        'blend':         { en: 'Blend', es: 'Blend', it: 'Blend', fr: 'Assemblage' },
        'doce':          { en: 'Sweet', es: 'Dulce', it: 'Dolce', fr: 'Doux' },
        'espumante':     { en: 'Sparkling', es: 'Espumoso', it: 'Spumante', fr: 'Effervescent' },
        'reserva':       { en: 'Reserve', es: 'Reserva', it: 'Riserva', fr: 'Réserve' },
        'gran reserva':  { en: 'Grand Reserve', es: 'Gran Reserva', it: 'Gran Riserva', fr: 'Grande Réserve' }
    };

    var MESES_DICT = {
        pt: ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        en: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        es: ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        it: ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        fr: ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    };

    var MESES_ABREV_DICT = {
        pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        it: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        fr: ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
    };

    /* Plural: [singular, plural] por idioma */
    var PLURALS = {
        vinho:    { pt: ['vinho', 'vinhos'], en: ['wine', 'wines'], es: ['vino', 'vinos'], it: ['vino', 'vini'], fr: ['vin', 'vins'] },
        pais:     { pt: ['país', 'países'], en: ['country', 'countries'], es: ['país', 'países'], it: ['paese', 'paesi'], fr: ['pays', 'pays'] },
        casta:    { pt: ['casta', 'castas'], en: ['grape variety', 'grape varieties'], es: ['variedad', 'variedades'], it: ['vitigno', 'vitigni'], fr: ['cépage', 'cépages'] },
        rotulo:   { pt: ['rótulo', 'rótulos'], en: ['label', 'labels'], es: ['etiqueta', 'etiquetas'], it: ['etichetta', 'etichette'], fr: ['étiquette', 'étiquettes'] },
        vez:      { pt: ['vez', 'vezes'], en: ['time', 'times'], es: ['vez', 'veces'], it: ['volta', 'volte'], fr: ['fois', 'fois'] },
        avaliado: { pt: ['avaliado', 'avaliados'], en: ['rated', 'rated'], es: ['evaluado', 'evaluados'], it: ['valutato', 'valutati'], fr: ['évalué', 'évalués'] }
    };

    /* ============================================================
       FUNÇÕES AUXILIARES
       ============================================================ */
    function normalizeKey(str) {
        return String(str || '')
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .toLowerCase().trim();
    }

    function detectLang() {
        try {
            var params = new URLSearchParams(window.location.search);
            var fromUrl = params.get('lang');
            if (fromUrl && SUPPORTED.indexOf(fromUrl) !== -1) return fromUrl;
        } catch (e) {}
        try {
            var stored = localStorage.getItem('site_lang');
            if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
        } catch (e) {}
        return DEFAULT_LANG;
    }

    var currentLang = detectLang();

    function getLang() { return currentLang; }

    function setLang(lang) {
        if (SUPPORTED.indexOf(lang) === -1) return;
        currentLang = lang;
        try { localStorage.setItem('site_lang', lang); } catch (e) {}
        document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-br' : lang);
        applyStaticI18n();
        try {
            var url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.replaceState({}, '', url);
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
    }

    function interpolate(str, vars) {
        if (!vars) return str;
        return str.replace(/\{(\w+)\}/g, function (m, key) {
            return (vars[key] !== undefined && vars[key] !== null) ? vars[key] : '';
        });
    }

    function t(key, vars) {
        var parts = key.split('.');
        var dict = DICT[currentLang] || DICT[DEFAULT_LANG];
        var node = dict;
        for (var i = 0; i < parts.length; i++) {
            if (node && Object.prototype.hasOwnProperty.call(node, parts[i])) {
                node = node[parts[i]];
            } else {
                node = null;
                break;
            }
        }
        if (node === null || typeof node !== 'string') {
            // fallback: pt
            node = DICT.pt;
            for (var j = 0; j < parts.length; j++) {
                if (node && Object.prototype.hasOwnProperty.call(node, parts[j])) node = node[parts[j]];
                else { node = key; break; }
            }
        }
        return typeof node === 'string' ? interpolate(node, vars) : key;
    }

    function pluralWord(n, wordId) {
        var entry = PLURALS[wordId];
        if (!entry) return String(n);
        var pair = entry[currentLang] || entry.pt;
        return n + ' ' + (Number(n) === 1 ? pair[0] : pair[1]);
    }

    function translateCountry(original) {
        if (!original) return original;
        if (currentLang === 'pt') return original;
        var key = normalizeKey(original);
        var entry = PAIS_DICT[key];
        return entry ? (entry[currentLang] || original) : original;
    }

    function translateTipo(original) {
        if (!original) return original;
        if (currentLang === 'pt') return original;
        var key = normalizeKey(original);
        var entry = TIPO_DICT[key];
        return entry ? (entry[currentLang] || original) : original;
    }

    function translateClassificacao(original) {
        if (!original) return original;
        if (currentLang === 'pt') return original;
        var key = normalizeKey(original);
        var entry = CLASSIFICACAO_DICT[key];
        return entry ? (entry[currentLang] || original) : original;
    }

    function translateMonth(monthIndex1to12) {
        var arr = MESES_DICT[currentLang] || MESES_DICT.pt;
        return arr[monthIndex1to12] || '';
    }

    function translateMonthAbrev(idx0to11) {
        var arr = MESES_ABREV_DICT[currentLang] || MESES_ABREV_DICT.pt;
        return arr[idx0to11] || '';
    }

    /* ============================================================
       APLICAÇÃO NO DOM (data-i18n)
       ============================================================ */
    function applyStaticI18n(root) {
        var scope = root || document;

        scope.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            var val = t(key);
            if (el.hasAttribute('data-i18n-html')) el.innerHTML = val;
            else el.textContent = val;
        });

        scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
        });

        scope.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
        });

        scope.querySelectorAll('[data-i18n-title]').forEach(function (el) {
            el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
        });

        scope.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
            el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
        });

        // <title> e meta description da página, se marcados
        var titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) document.title = t(titleEl.getAttribute('data-i18n'));
    }

    /* ============================================================
       SELETOR DE IDIOMA (injetado pelo nav.js na navbar)
       ============================================================ */
    function buildSwitcherHTML() {
        var options = SUPPORTED.map(function (l) {
            return '<button type="button" class="lang-option' + (l === currentLang ? ' active' : '') + '" data-lang="' + l + '" role="menuitemradio" aria-checked="' + (l === currentLang) + '">' +
                '<img class="lang-flag" src="' + flagUrl(l) + '" alt="" aria-hidden="true" loading="lazy"> <span class="lang-name">' + LANG_NAMES[l] + '</span></button>';
        }).join('');

        return '' +
            '<li class="lang-switcher" id="lang-switcher">' +
                '<button class="lang-trigger" id="lang-trigger" aria-haspopup="true" aria-expanded="false" aria-label="' + t('switcher.label') + '">' +
                    '<img class="lang-flag" src="' + flagUrl(currentLang) + '" alt="" aria-hidden="true">' +
                    '<span class="lang-code">' + currentLang.toUpperCase() + '</span>' +
                    '<i class="fa fa-caret-down" aria-hidden="true" style="font-size:0.7rem;"></i>' +
                '</button>' +
                '<div class="lang-dropdown" id="lang-dropdown" role="menu">' + options + '</div>' +
            '</li>';
    }

    function wireSwitcher(container) {
        var scope = container || document;
        var trigger = scope.querySelector('#lang-trigger');
        var dropdown = scope.querySelector('#lang-dropdown');
        if (!trigger || !dropdown) return;

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', isOpen);
        });

        dropdown.querySelectorAll('.lang-option').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                setLang(btn.getAttribute('data-lang'));
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function (e) {
            if (dropdown.classList.contains('open') && !dropdown.contains(e.target) && !trigger.contains(e.target)) {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* Re-render do próprio botão do seletor quando o idioma muda (fora do escopo do navbar) */
    window.addEventListener('i18n:change', function () {
        var trigger = document.getElementById('lang-trigger');
        if (trigger) {
            trigger.querySelector('.lang-code').textContent = currentLang.toUpperCase();
            trigger.querySelector('.lang-flag').src = flagUrl(currentLang);
            trigger.setAttribute('aria-label', t('switcher.label'));
        }
        var dropdown = document.getElementById('lang-dropdown');
        if (dropdown) {
            dropdown.querySelectorAll('.lang-option').forEach(function (btn) {
                var isActive = btn.getAttribute('data-lang') === currentLang;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-checked', isActive);
            });
        }
    });

    /* ============================================================
       HREFLANG
       ============================================================ */
    function injectHreflang() {
        try {
            var url = new URL(window.location.href);
            SUPPORTED.forEach(function (l) {
                url.searchParams.set('lang', l);
                var link = document.createElement('link');
                link.rel = 'alternate';
                link.hreflang = l === 'pt' ? 'pt-BR' : l;
                link.href = url.toString();
                document.head.appendChild(link);
            });
            url.searchParams.set('lang', 'pt');
            var def = document.createElement('link');
            def.rel = 'alternate';
            def.hreflang = 'x-default';
            def.href = url.toString();
            document.head.appendChild(def);
        } catch (e) {}
    }

    /* ============================================================
       EXPORTS
       ============================================================ */
    window.I18N = {
        SUPPORTED: SUPPORTED,
        getLang: getLang,
        setLang: setLang,
        t: t,
        pluralWord: pluralWord,
        translateCountry: translateCountry,
        translateTipo: translateTipo,
        translateClassificacao: translateClassificacao,
        translateMonth: translateMonth,
        translateMonthAbrev: translateMonthAbrev,
        applyStaticI18n: applyStaticI18n,
        buildSwitcherHTML: buildSwitcherHTML,
        wireSwitcher: wireSwitcher,
        injectHreflang: injectHreflang
    };

    document.documentElement.setAttribute('lang', currentLang === 'pt' ? 'pt-br' : currentLang);

    document.addEventListener('DOMContentLoaded', function () {
        applyStaticI18n();
        injectHreflang();
    });
})();
