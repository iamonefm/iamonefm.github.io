(function () {
    'use strict';
    function srcswp(src) {

        Lampa.Template.add('src', `
        <div class="src_modal_root">
        <div class="src_grid">
            {src_tmp_Content}
        </div>
        </div>
        `);

        function updateActivitySource(newSource) {
            const STORAGE_KEY = 'activity';

            try {

                const rawData = localStorage.getItem(STORAGE_KEY);
                if (!rawData) {
                    console.warn(`Ключ ${STORAGE_KEY} не найден в localStorage`);
                    return false;
                }

                const activity = JSON.parse(rawData);
                if (!activity || typeof activity !== 'object') {
                    throw new Error('Данные не являются объектом');
                }

                const oldSource = activity.source;
                activity.source = newSource;

                localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));

                // console.log(`Source изменён с "${oldSource}" на "${newSource}"`);
                return true;

            } catch (error) {
                console.error('Ошибка при обновлении activity:', error);
                return false;
            }
        }

        const searchElement = document.querySelector('.head__action.head__settings.selector.open--search');

        if (searchElement) {
            searchElement.insertAdjacentHTML('afterend', `
            <div class="head__action head__settings selector open--src">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 8C6.88071 8 8 6.88071 8 5.5C8 4.11929 6.88071 3 5.5 3C4.11929 3 3 4.11929 3 5.5C3 6.88071 4.11929 8 5.5 8ZM5.5 8V16M5.5 16C4.11929 16 3 17.1193 3 18.5C3 19.8807 4.11929 21 5.5 21C6.88071 21 8 19.8807 8 18.5C8 17.1193 6.88071 16 5.5 16ZM18.5 8C19.8807 8 21 6.88071 21 5.5C21 4.11929 19.8807 3 18.5 3C17.1193 3 16 4.11929 16 5.5C16 6.88071 17.1193 8 18.5 8ZM18.5 8C18.5 8.92997 18.5 9.39496 18.3978 9.77646C18.1204 10.8117 17.3117 11.6204 16.2765 11.8978C15.895 12 15.43 12 14.5 12H8.5C6.84315 12 5.5 13.3431 5.5 15" 
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></path>
            </svg>
            </div>
            `);

            const srcElement = searchElement.nextElementSibling;

            function swap_src() {
                const srcList = Lampa.Params.values['source'];
                const currentSource = Lampa.Storage.get('source');

                const src_Content = Object.entries(srcList)
                    .map(([key, name]) => {
                        
                        const isActive = key === currentSource ? 'active' : '';

                        return `
                    <div class="src_item selector navigation-tabs__button ${isActive}" data-src="${key}">
                        ${name}
                    </div>
                    `;
                    })
                    .join('');

                const src_render_templates = Lampa.Template.get('src', {
                    src_tmp_Content: src_Content
                });

                Lampa.Modal.open({
                    title: '',
                    html: src_render_templates,
                    onBack: function onBack() {
                        Lampa.Modal.close();

                        Lampa.Controller.toggle('content');
                    },
                    onSelect: function onSelect(a) {
                        const src_swap = a.attr('data-src');

                        Lampa.Storage.set("source", src_swap);
                        updateActivitySource(src_swap);

                        Lampa.Modal.close();

                        try {
                            const { url, source, title, component } = Lampa.Storage.get('activity') || {};

                            Lampa.Activity.push({
                                url: url,
                                title: Lampa.Lang.translate('menu_movies') + ' - ' + Lampa.Storage.get('source').toUpperCase(),
                                component: component,
                                source: src_swap
                            });

                        } catch (e) {
                            console.error('Ошибка чтения storage:', e);
                        }

                    }
                });
            }

            $(srcElement).on('hover:enter', swap_src);

        } else {
            console.error('Элемент .open--search не найден!');
        }

    }

    if (window.appready) {
        srcswp();
    }
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                srcswp();
            }
        });
    }
})();
