/// *** rethinking ***

(function () {
    'use strict';

    Lampa.Lang.add({
        params_ani_on: {
            ru: 'Включить',
            en: 'Enable'
        },
        params_ani_select: {
            ru: 'Выключить',
            en: 'Select loading animation'
        },
        params_ani_name: {
            ru: 'Анимация Загрузки',
            en: 'Loading animation'
        },
    });

    let svg_links = [
        'https://iamonefm.github.io/svg/dots.svg',
        'https://iamonefm.github.io/svg/dots_x2.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/90-ring-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/90-ring-with-bg-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/180-ring-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/180-ring-with-bg-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/270-ring-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/270-ring-with-bg-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/bars-rotate-fade-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/blocks-scale-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/blocks-shuffle-2-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/blocks-shuffle-3-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/blocks-wave-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/pulse-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/pulse-2-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/pulse-3-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/pulse-multiple-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/pulse-ring-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/pulse-rings-2-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/pulse-rings-3-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/pulse-rings-multiple-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/3-dots-bounce-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/3-dots-fade-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/3-dots-scale-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/dot-revolve-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/bouncing-ball-white-36.svg',
        'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/gooey-balls-2-white-36.svg'
    ];

    function hexToCssFilter(hexColor, calibrate = true) {
        if (hexColor) {

            const hex = hexColor.replace('#', '');
            if (hex.length !== 6) return 'none';

            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;

            let hue = 0;
            if (delta !== 0) {
                if (max === r) hue = ((g - b) / delta) % 6;
                else if (max === g) hue = (b - r) / delta + 2;
                else hue = (r - g) / delta + 4;
                hue = Math.round(hue * 60);
                if (hue < 0) hue += 360;
            }

            const saturation = max === 0 ? 0 : delta / max;
            const brightness = max;

            let sepia = 1;
            let hueRotate = hue - 40;
            let saturateValue = saturation * 10;
            let brightnessValue = brightness * 0.8 + 0.2;

            if (calibrate) {

                if (hue >= 180 && hue <= 240) {
                    hueRotate += 5;
                    saturateValue *= 1.2;
                    sepia /= 2.5;
                    brightnessValue /= 1.6;

                }

                else if (hue >= 240 && hue <= 300) {
                    hueRotate += 5;
                    saturateValue *= 1.2;
                    brightnessValue *= 1.09;
                    sepia /= 2.5;

                }

                else if (hue <= 20 || hue >= 340) {
                    hueRotate -= 10;
                    brightnessValue /= 4.55;

                }

                else if (hue >= 70 && hue <= 160) {
                    hueRotate -= 15;
                    saturateValue *= 0.9;
                    brightnessValue *= 1.09;
                    sepia /= 2.5;

                }

                else if (hue >= 14 && hue <= 60) {
                    hueRotate -= 15;
                    saturateValue *= 0.9;
                    brightnessValue /= 2.45;
                    sepia /= 1.25;

                }

                else if (hue >= 300 && hue <= 360) {
                    hueRotate -= 15;
                    saturateValue *= 0.9;
                    brightnessValue /= 4.6;

                }

            }

            hueRotate = Math.max(0, Math.min(360, hueRotate));
            saturateValue = Math.max(0, Math.min(20, saturateValue));
            brightnessValue = Math.max(0, Math.min(2, brightnessValue));

            return `brightness(${brightnessValue.toFixed(2)}) sepia(${sepia}) hue-rotate(${Math.round(hueRotate)}deg) saturate(${saturateValue.toFixed(2)})`;
        } else
            return undefined;
    }

    Lampa.Template.add('ani_modal', `
    <div class="ani_modal_root">
    <div class="ani_grid">
    {ani_svg_content}
    </div>
    </div>
    `);

    // Maybe ....
    // let cachedThemeColor;
    // function get_by_theme() {
    // if (!cachedThemeColor) {
    //     cachedThemeColor = getComputedStyle(document.documentElement)
    //     .getPropertyValue('--main-color')
    //     .trim();
    // }
    // return cachedThemeColor || null;
    // }

    // document.documentElement.addEventListener('style-change', () => {
    // cachedThemeColor = null;
    // });

    function create_ani_modal() {

        let style = document.createElement('style');
        style.id = 'aniload';
        style.textContent = `
                .ani_row {
                            display: grid;
                            grid-template-columns:
                                repeat(7, 1fr);
                            grid-auto-rows: 1fr;
                            gap: 40px;
                            justify-items: center;
                            width: 100%;
                            height: 72px;
                            padding: 10px;
                }
                .ani_svg {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 100%;
                }
                .ani_svg img {
                            max-width: 100%;
                            max-height: 100%;
                            object-fit: contain;
                }
                
                .ani_svg.focus {
                            background-color: #353535;
                            justify-content: center;
                            align-items: center;
                            border: 1px solid #9e9e9e;
                }
        `;
        document.head.appendChild(style);
    }

    function remove_activity_loader() {
        let styleElement = document.getElementById('aniload_activity__loader');
        if (styleElement) {
            styleElement.remove();
            // console.log('***', '<style> с id "aniload_activity__loader" delete.');
        } else {
            // console.log('***', '<style> с id "aniload_activity__loader" not found.');
        }
    }

    function createSvgHtml(src) {
        return `
            <div class="ani_svg selector" tabindex="0">
            <picture>
                <source srcset="${src}" media="(prefers-color-scheme: light),(prefers-color-scheme: dark)">
                <img src="${src}" style="visibility:visible; max-width:100%; fill:#ffffff">
            </picture>
            </div>
        `;
    }

    function chunkArray(arr, size) {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    function insert_activity_loader(url, filter) {

        $('#aniload-id').remove();

        const escapedUrl = url.replace(/'/g, "\\'");

        if (Boolean(filter) === false) {
            var newStyle_activity_loader = `
                .activity__loader {
                    background: url('${escapedUrl}') no-repeat 50% 50% !important;
                    scale: 1.9;
                }
            `;
        } else {
            var newStyle_activity_loader = `
                .activity__loader {
                    background: url('${escapedUrl}') no-repeat 50% 50% !important;
                    scale: 1.9;
                    filter: ${hexToCssFilter(filter)};
                }
            `;
        }

        $('<style id="aniload-id">' + newStyle_activity_loader + '</style>').appendTo('head');
    }

    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        const newStyle_activity_loader_prv = `
            .activity__loader_prv {
                position: absolute;
                top: 0;
                width: 145%;
                height: 86%;
                background: url('${escapedUrl}') no-repeat 50% 50%;
                z-index: 9999; 
            }
        `;
        $('<style id="aniload-id-prv">' + newStyle_activity_loader_prv + '</style>').appendTo('head');
    }

    function remove_activity_loader() {
        let styleElement = document.getElementById('aniload-id');
        if (styleElement) {
            styleElement.remove();
        }

    }

    function aniLoad() {
        var icon_plugin = '<svg height="32" viewBox="0 0 24 26" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"/></svg>'
        Lampa.SettingsApi.addComponent({
            component: 'ani_load_menu',
            name: Lampa.Lang.translate('params_ani_name'),
            icon: icon_plugin,
        },);

        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: {
                name: 'ani_active',
                type: 'trigger',
                default: false,
            },
            field: {
                name: Lampa.Lang.translate('params_ani_on'),
            },
            onChange: function (item) {
                if (item == 'true') {
                    if (!!Lampa.Storage.get("ani_load") && !!Lampa.Storage.get("ani_active")) {
                        insert_activity_loader(Lampa.Storage.get("ani_load"), getComputedStyle(document.documentElement).getPropertyValue('--main-color'))
                    }
                    // console.log("***", 'Лоадер активен', Lampa.Storage.get("ani_load"));
                } else if (item == 'false') {
                    remove_activity_loader()
                    // console.log("***", 'New ami not active', Lampa.Storage.get("ani_load"));
                }
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: {
                name: 'select_ani_mation',
                type: 'button',
            },
            field: {
                name: Lampa.Lang.translate('params_ani_select'),
                description: '<div class="activity__loader_prv"></div>'
            },
            onRender: function (item) {
                insert_activity_loader_prv(Lampa.Storage.get("ani_load"));
            },

            onChange: function (item) {
                create_ani_modal();
                const groupedSvgLinks = chunkArray(svg_links, 7);
                let svg_content = groupedSvgLinks.map(group => {
                    const groupContent = group.map(createSvgHtml).join('');
                    return `<div class="ani_row">${groupContent}</div>`;
                }).join('');

                let ani_templates = Lampa.Template.get('ani_modal', {
                    ani_svg_content: svg_content
                });
                Lampa.Modal.open({
                    title: '',
                    size: 'medium',
                    align: 'center',
                    html: ani_templates,
                    onBack: () => {
                        Lampa.Modal.close()
                        Lampa.Controller.toggle('settings_component')
                    },
                    onSelect: function onSelect(a) {
                        Lampa.Modal.close()
                        Lampa.Controller.toggle('settings_component')
                        if (a.length > 0 && a[0] instanceof HTMLElement) {
                            const element = a[0];
                            const imgElement = element.querySelector('img');
                            if (imgElement) {
                                const srcValue = imgElement.getAttribute('src');
                                Lampa.Storage.set("ani_load", srcValue);
                                if (!!Lampa.Storage.get("ani_load") && !!Lampa.Storage.get("ani_active")) {
                                    insert_activity_loader(Lampa.Storage.get("ani_load"), getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
                                    insert_activity_loader_prv(Lampa.Storage.get("ani_load"));
                                }
                            } else {
                                // console.log('*** <img> not found');
                            }
                        } else {
                            // console.log('*** The passed object does not contain a DOM element'); 
                        }
                    },
                })
            },
        });

        if (!!Lampa.Storage.get("ani_load") && !!Lampa.Storage.get("ani_active")) {
            insert_activity_loader(Lampa.Storage.get("ani_load"), getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
        }

    }
    
    function byTheme() {
        if (!!Lampa.Storage.get("ani_load") && !!Lampa.Storage.get("ani_active")) {
            const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
            if (typeof insert_activity_loader === 'function') {
                    insert_activity_loader(Lampa.Storage.get("ani_load"), mainColor);
                }
        }    
    }

    // Инициализация
    if (window.Lampa && Lampa.Storage && Lampa.Listener) {
        if (window.appready) {
            initThemeAndLoader();
            setupThemeListener();
        } else {
            const appReadyListener = (e) => {
                if (e.type === 'ready') {
                    initThemeAndLoader();
                    setupThemeListener();
                    Lampa.Listener.follow('app', appReadyListener);
                }
            };
            Lampa.Listener.follow('app', appReadyListener);
        }
    } else {
        console.error('**** Lampa core modules are not available!');
    }

    function initThemeAndLoader() {
        var main_color = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
        if (main_color && typeof byTheme === 'function') byTheme();
        if (typeof aniLoad === 'function') aniLoad();
    }

    function setupThemeListener() {
        Lampa.Storage.listener.follow('change', (e) => {
            if (e) {
                var main_color = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
                if (main_color && typeof byTheme === 'function') byTheme();
            }
        });
    }
})();
