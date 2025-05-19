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
            $('[data-component="plugins"]').insertAfter('[data-component="account"]'); // move up plugins in settings-folder - request Ruslan>0>1
            const STORAGE_KEY = 'activity';
            
            try {
                const activity = JSON.parse(localStorage.getItem(STORAGE_KEY) || {});
                
                if (!activity.source) {

                    console.log('Swap_src', 'Объект activity не содержит свойство source');
                    return false;
                }

                activity.source = newSource;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
                return true;
                
            } catch (error) {

                console.log('Swap_src', 'Ошибка при обновлении activity:', error);
                return false;
            }
        }

        const searchElement = document.querySelector('.head__action.head__settings.selector.open--search');

        if (searchElement) {
            searchElement.insertAdjacentHTML('afterend', `
            <div class="head__action head__settings selector open--src">
            <svg width="24" height="24" viewBox="0 0 533 533" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">
            <path fill="currentcolor" d="M476.472 266.407c31.575 0 57.253-25.684 57.253-57.265 0-31.575-25.678-57.265-57.253-57.265-31.574 0-57.264 25.69-57.264 57.265 0 10.667 2.988 20.627 8.08 29.193l-98.812 72.024c-15.251-16.604-36.666-27.324-60.646-28.562l-6.159-99.991c33.034-6.667 57.977-35.896 57.977-70.857 0.023-39.842-32.416-72.27-72.275-72.27-39.854 0-72.305 32.427-72.305 72.281 0 38.003 29.496 69.175 66.781 71.995l6.16 100.032c-27.914 4.904-51.31 22.852-63.711 47.363l-58.59-21.639c0.654-3.619 1.051-7.321 1.051-11.128 0-34.944-28.434-63.366-63.389-63.366C28.445 234.219 0 262.641 0 297.585c0 34.95 28.434 63.384 63.372 63.384 24.154 0 45.155-13.569 55.857-33.49l58.193 21.51c-1.676 6.795-2.668 13.825-2.668 21.123 0 48.846 39.737 88.582 88.571 88.582 33.46 0 62.63-18.671 77.693-46.112l62.263 25.386c-0.514 2.826-0.888 5.711-0.888 8.676 0 26.684 21.708 48.402 48.425 48.402 26.682 0 48.39-21.719 48.39-48.402 0-26.693-21.708-48.4-48.39-48.4-16.687 0-31.399 8.453-40.111 21.322l-62.238-25.41c2.172-7.66 3.398-15.693 3.398-24.043 0-15.916-4.286-30.816-11.654-43.754l100.037-72.923C450.128 261.543 462.74 266.407 476.472 266.407zM63.383 341.117c-23.973 0-43.497-19.523-43.497-43.532 0-23.979 19.524-43.503 43.497-43.503 24.002 0 43.526 19.512 43.526 43.503 0 24.014-19.524 43.532-43.526 43.532zM450.83 418.116c15.74 0 28.539 12.786 28.539 28.538 0 15.741-12.799 28.551-28.539 28.551-15.764 0-28.562-12.81-28.562-28.551 0-15.752 12.798-28.538 28.562-28.538zM194.926 110.961c0-28.913 23.535-52.43 52.448-52.43 28.901 0 52.424 23.518 52.424 52.43 0 28.901-23.523 52.424-52.424 52.424-28.913 0-52.448-23.523-52.448-52.424zM476.472 171.752c20.622 0 37.391 16.78 37.391 37.39 0 20.627-16.769 37.39-37.391 37.39-20.633 0-37.39-16.763-37.39-37.39 0-20.61 16.757-37.39 37.39-37.39z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
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
                    select: src_render_templates.find('.navigation-tabs__button.active')[0],
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
                            Lampa.Activity.push({
                                url: '',
                                title: Lampa.Lang.translate('title_main') + ' - ' + Lampa.Storage.get('source').toUpperCase(),
                                component: 'main',
                                source: src_swap
                            });

                        } catch (e) {
                            console.log('Swap_src', 'Ошибка чтения storage: ', e);
                        }

                    }
                });
            }

            $(srcElement).on('hover:enter', swap_src);

        } else {

            console.log('Swap_src', 'Элемент .open--search не найден!');
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
