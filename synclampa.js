(function () {

    'use strict';
    function log_sync(type,) {
        var activity = Lampa.Storage.get('activity', '{}');
        var card = activity.movie || activity.card || activity.component; 
        console.log('SYNC', type, card.name);
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function _defineProperties(target, props) {
        for (var i = 0;
            i < props.length;
            i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
            writable: false
        });
        return Constructor;
    }
    var Timecode =/*#__PURE__*/function () {
        function Timecode(field) {
            _classCallCheck(this, Timecode);
            var syncExtHttps = Lampa.Storage.get('sync_ext_https');
            var syncExtAddress = Lampa.Storage.get('sync_ext_address');
            var protocol = syncExtHttps ? 'https://' : 'http://';
            var url = protocol + syncExtAddress;
            this.localhost = url;
            this.network = new Lampa.Reguest();
            this.card_id = null;
        } _createClass(Timecode, [{
            key: "init", value: function init() {
                var _this = this;
                Lampa.Timeline.listener.follow('update', this.add.bind(this));
                Lampa.Listener.follow('full', function (e) {
                    if (e.type == 'complite') { _this.update(); _this.update_mark() };
                });
                Lampa.Storage.listener.follow('change', function (e) {
                    if (e.name == 'online_view') _this.mark(e);
                });
            }
        }, {
            key: "url", value: function url(method) {
                var url = this.localhost + '/timecode/' + method;
                var account = Lampa.Storage.get('account', '{}');
                var activity = Lampa.Storage.get('activity', '{}');
                var card = activity.movie || activity.card || { id: 0 };
                var card_id = (card.id || 0) + '_' + (card.name ? 'tv' : 'movie');
                this.card_id = card.id;
                if (account.email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(account.email));
                if (account.profile) url = Lampa.Utils.addUrlComponent(url, 'profile=' + encodeURIComponent(account.profile.id));
                url = Lampa.Utils.addUrlComponent(url, 'card_id=' + encodeURIComponent(card_id));
                return url;
            }
        }, {
            key: "filename", value: function filename() {
                var acc = Lampa.Storage.get('account', '{}');
                var name = 'file_view' + (acc.profile ? '_' + acc.profile.id : '');
                if (window.localStorage.getItem(name) === null && acc.profile) {
                    Lampa.Storage.set(name, Lampa.Arrays.clone(Lampa.Storage.cache('file_view', 10000, {})));
                }
                return name;
            }
        }, {
            key: "update", value: function update() {
                var _this2 = this; var url = this.url('all');
                this.network.silent(url, 
                    function (result) {
                    if (result.accsdb) return;
                    var viewed = Lampa.Storage.cache(_this2.filename(), 10000, {});
                    for (var i in result) {
                        if (!Lampa.Arrays.isObject(result[i])) continue;
                        viewed[i] = result[i];
                        Lampa.Arrays.extend(viewed[i], { duration: 0, time: 0, percent: 0 });
                        delete viewed[i].hash;
                    }
                    Lampa.Storage.set(_this2.filename(), viewed, true);
                    Lampa.Storage.set("file_view", viewed, true);
                    log_sync(' Get timecode ');
                    },
                    log_sync(' Error Get timecode ')
                );
            }
        },
        {
            key: "add", value: function add(e) {
                var url = this.url('add');
                this.network.silent(url, false, false, { id: e.data.hash, data: JSON.stringify(e.data.road) });
                log_sync(' Add timecode ');
            }
        },
        {
            key: "mark", value: function mark(e) {
                var url = this.url('mark');
                this.network.silent(url, 
                    function () {
                        stsus_sync_profile_icon('#93d46d');
                    }, 
                    function () {
                        stsus_sync_profile_icon('red');
                    },
                    { id: this.card_id, data: JSON.stringify(e.value) });
                log_sync(' Post Marks ');
            }
        }
            , {
            key: "update_mark", value: function update_mark() {
                // Lampa.Storage.set("online_view", [], true);
                var url = this.url('mark');
                this.network.silent(url, 
                    function (result) {
                        if (result.accsdb) return;
                        Lampa.Storage.set("online_view_ext", result, true);
                        Lampa.Storage.set("online_view", result, true);
                        log_sync(' Get Marks ');
                        stsus_sync_profile_icon('#93d46d');
                    },
                    function () {
                        stsus_sync_profile_icon('red');
                    }
                );
            }
        }
        ]);
        return Timecode;
    }();
//*****************************************************************************************************************
    function stsus_sync_profile_icon (color){
        $(document).ready(function () {
            // var color = value;//'#93d46d'
            var css = `.noticesync.active::after 
            { content: ""; display: block; width: 0.5em; height: 0.5em; left: 0; bottom: 0; margin-top: 60%;
            position: absolute; background-color: ${color}; 
            border: 0.15em solid #fff; 
            border-radius: 100%;}`;
            $("<style>")
                .prop("type", "text/css")
                .html(css)
                .appendTo("head");
        }); 
            $("#app .head .head__actions .head__action.selector.open--profile").addClass("noticesync");
            $("#app .head .head__actions .head__action.selector.open--profile").addClass("active");
        // console.log('SYNC', 'status sync for profile icon');
    }
    function syncExt() {
        // stsus_sync_profile_icon ('#93d46d');
        var sync = Lampa.Storage.get('sync_ext_switcher');
        if (sync === true) {
            stsus_sync_profile_icon('#93d46d');
        } else if (sync === false){
            stsus_sync_profile_icon('black');
        }
        console.log('SYNC', 'Status: ', sync);
        // sync_options();        
        var icon_add_plugin = '<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">\n' + '<path d="M66.6667 215.921C66.6667 170.027 66.6667 147.08 74.056 128.94C84.215 104.002 104.002 84.215 128.94 74.056C147.08 66.6667 170.027 66.6667 215.921 66.6667C261.814 66.6667 284.761 66.6667 302.901 74.056C327.839 84.215 347.627 104.002 357.787 128.94C365.173 147.08 365.173 170.027 365.173 215.921C365.173 261.814 365.173 284.761 357.787 302.901C347.627 327.839 327.839 347.627 302.901 357.787C284.761 365.173 261.814 365.173 215.921 365.173C170.027 365.173 147.08 365.173 128.94 357.787C104.002 347.627 84.215 327.839 74.056 302.901C66.6667 284.761 66.6667 261.814 66.6667 215.921Z" fill="white"/>\n' + '<path d="M66.6667 584.08C66.6667 538.187 66.6667 515.24 74.056 497.1C84.215 472.163 104.002 452.373 128.94 442.217C147.08 434.827 170.027 434.827 215.921 434.827C261.814 434.827 284.761 434.827 302.901 442.217C327.839 452.373 347.627 472.163 357.787 497.1C365.173 515.24 365.173 538.187 365.173 584.08C365.173 629.973 365.173 652.92 357.787 671.06C347.627 696 327.839 715.787 302.901 725.943C284.761 733.333 261.814 733.333 215.921 733.333C170.027 733.333 147.08 733.333 128.94 725.943C104.002 715.787 84.215 696 74.056 671.06C66.6667 652.92 66.6667 629.973 66.6667 584.08Z" fill="white"/>\n' + '<path d="M434.83 584.08C434.83 538.187 434.83 515.24 442.22 497.1C452.38 472.163 472.167 452.373 497.103 442.217C515.243 434.827 538.19 434.827 584.083 434.827C629.98 434.827 652.927 434.827 671.063 442.217C696.003 452.373 715.79 472.163 725.95 497.1C733.34 515.24 733.34 538.187 733.34 584.08C733.34 629.973 733.34 652.92 725.95 671.06C715.79 696 696.003 715.787 671.063 725.943C652.927 733.333 629.98 733.333 584.083 733.333C538.19 733.333 515.243 733.333 497.103 725.943C472.167 715.787 452.38 696 442.22 671.06C434.83 652.92 434.83 629.973 434.83 584.08Z" fill="white"/>\n' + '<path fill-rule="evenodd" clip-rule="evenodd" d="M559.083 315.922C559.083 329.729 570.273 340.923 584.083 340.923C597.89 340.923 609.083 329.729 609.083 315.922V240.922H684.083C697.89 240.922 709.083 229.729 709.083 215.922C709.083 202.115 697.89 190.922 684.083 190.922H609.083V115.922C609.083 102.115 597.89 90.922 584.083 90.922C570.273 90.922 559.083 102.115 559.083 115.922V190.922H484.083C470.273 190.922 459.083 202.115 459.083 215.922C459.083 229.729 470.273 240.922 484.083 240.922H559.083V315.922Z" fill="white"/>\n' + '</svg>'
        Lampa.SettingsApi.addComponent({
            component: 'sync_ext',
            name: "Sync Mark & Time",
            icon: icon_add_plugin,
        });
        Lampa.SettingsApi.addParam({
            component: 'sync_ext',
            param: {
                name: 'sync_ext_switcher',
                type: 'trigger', //доступно select,input,trigger,title,static
                default: false,
            },
            field: {
                name: ' Синхронизация',
                description: `Включает альтернативную синхронизацию.  
                </br>После включения будет создана резервная запись Ваших текущих "просмотров" и "марок" в локальном хранилище, при отключении она вернется обратно.`
                // </br>Для сохранения резервной копии на сервере, воспользуйтесь пунктом 
                // </br><b><i>Резервное копирование<i><b>.`
            },
            onChange: function (value) {
                if (value == 'false') {
                    $('.settings-param.selector').not(':first').toggleClass('selector').toggleClass('hide');
                    if (Lampa.Storage.get('online_view_bak')) Lampa.Storage.set('online_view', Lampa.Storage.get('online_view_bak'));
                    if (Lampa.Storage.get('file_view_bak')) Lampa.Storage.set('file_view', Lampa.Storage.get('file_view_bak'));
                    stsus_sync_profile_icon('black');
                    console.log('SYNC', 'Синхронизация выкл.');
                } else if (value == 'true') {
                    Lampa.Storage.set('online_view_bak', Lampa.Storage.get('online_view'));
                    Lampa.Storage.set('file_view_bak', Lampa.Storage.get('file_view'));
                    $('.settings-param.hide').toggleClass('hide').toggleClass('selector');
                    stsus_sync_profile_icon('#93d46d');
                    console.log('SYNC', 'Синхронизация вкл.');
                }
                Lampa.Settings.update();
            },
            onRender: function () {
                setTimeout(function () {
                    if (Lampa.Storage.get('sync_ext_switcher') === 'false' || !Lampa.Storage.get('sync_ext_switcher'))
                        $('.settings-param.selector').not(':first').toggleClass('selector').toggleClass('hide');
                    if (Lampa.Storage.get('sync_ext_address')) {
                        chk_sync_ext_address(Lampa.Storage.get('sync_ext_address'), Lampa.Storage.get('sync_ext_https'));
                    }
                }, 0);
            }
        });
        Lampa.SettingsApi.addParam({
            component: 'sync_ext',
            param: {
                name: 'sync_ext_address',
                type: 'input', //доступно select,input,trigger,title,static
                values: '',
                default: '',
                placeholder: 'Например: 192.168.х или ya.ru',
            },
            field: {
                name: 'Сервер синхронизации',
                description: 'Адрес сервера',
            },
            onChange: function () {
                chk_sync_ext_address(Lampa.Storage.get('sync_ext_address'), Lampa.Storage.get('sync_ext_https'));
            },
            onRender: function () {
                setTimeout(function () {
                    $('.settings-param.selector[data-name="sync_ext_address"]').append('<div class="settings-param__status"></div>');
                }, 0);
            }
        });
        Lampa.SettingsApi.addParam({
            component: 'sync_ext',
            param: {
                name: 'sync_ext_https',
                type: 'trigger', //доступно select,input,trigger,title,static
                default: false
            },
            field: {
                name: 'Защищенное соединение',
                description: `Включение защищенного соединения (протокол https)
                </br> После изменения, для корректной работы, следует перезагрузить приложение.`
            },
            onChange: function () {
                chk_sync_ext_address(Lampa.Storage.get('sync_ext_address'), Lampa.Storage.get('sync_ext_https'));
                Lampa.Settings.update();
                    var code = new Timecode();
                    code.init();
                
            }
        });
        function chk_sync_ext_address(value, protocol) {
            if (protocol == false) {
                var url = Lampa.Utils.checkEmptyUrl(value) + '/status_server/';
            } else {
                var url = 'https://' + value + '/status_server/';
            }
            if (Lampa.Storage.get('sync_ext_switcher') == 'true') console.log('SYNC', 'address: ', value, ' url: ', url, ' https: ', protocol);
            fetch(url)
                .then(function (response) {
                    if (response.ok || response.status === 200) {
                        $('.settings-param__status, .settings-param__status.wait, .settings-param__status.error')
                            .removeClass('error wait')
                            .addClass('active');
                        stsus_sync_profile_icon('#93d46d');
                    } else if (response.status === 401) {
                        $('.settings-param__status, .settings-param__status.wait, .settings-param__status.active')
                            .removeClass('active wait')
                            .addClass('error');
                        stsus_sync_profile_icon('red');
                    }
                })
                .catch(function (error) {
                    $('.settings-param__status, .settings-param__status.wait, .settings-param__status.active')
                        .removeClass('active wait')
                        .addClass('error');
                    stsus_sync_profile_icon('red');
                    console.error('Ошибка при обращении к серверу синхронизации:', error);
                    console.log('SYNC', error.message);
                });
        }
    }
    function startPlugin() {
        window.lampac_timecode_plugin = true;
        if (Lampa.Timeline.listener) {
            var code = new Timecode();
            code.init();
        }
        if (window.appready) {
            syncExt();
        }
        else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') {
                    syncExt();
                }
            });
        }
    } if (!window.lampac_timecode_plugin) startPlugin();
})();
