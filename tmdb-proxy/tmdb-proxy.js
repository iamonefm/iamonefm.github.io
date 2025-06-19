(function () {
    'use strict';
  
    Lampa.Lang.add({
        tmdb_prox_custom_lang: {
            ru: 'Адрес TMDB-Proxy',
            en: 'Address TMDB-Proxy'
        },
    });

    function checkAndFormatURL(url, format) {
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)(:[0-9]{1,5})?(\/.*)?$/;

        const match = urlPattern.test(url);
        
        if (match) {
            const cleanUrl = url.replace(/^(https?:\/\/)/, '');
            const httpUrl = cleanUrl.startsWith('www.') ? 'http://' + cleanUrl : 'http://' + cleanUrl;
            const httpsUrl = cleanUrl.startsWith('www.') ? 'https://' + cleanUrl : 'https://' + cleanUrl;
            const protocol = url.startsWith('https://') ? 'https://' : 'http://';

            switch (format) {
                case 'http':
                    return httpUrl;
                case 'https':
                    return httpsUrl;
                case 'clear':
                    return cleanUrl;
                case 'protocol':
                    return protocol;
                default:
                    return null;
            }
        } else {
            return null;
        }
    };

     var domain = Lampa.Storage.get('TMDB-Prox-custom') 
        ? checkAndFormatURL(Lampa.Storage.field('TMDB-Prox-custom'), 'clear') + '/' 
        : 'imagetmdb.com/';

    var tmdb_proxy = {
      name: 'TMDB Proxy Custom',
      version: '0.0.1',
      description: 'Проксирование постеров и API сайта TMDB, на основе оригинального плагина 1.0.3',
      path_image: 'imagetmdb.' + domain + '/' ,
      path_api: 'apitmdb.' + domain + '/3/',
      protocol: checkAndFormatURL(Lampa.Storage.get('TMDB-Prox-custom'), 'protocol')
    };

    function filter(u) {
      var s = u.slice(0, 8);
      var e = u.slice(8).replace(/\/+/g, '/');
      return s + e;
    }

    function email() {
      return Lampa.Storage.get('account', '{}').email || '';
    }

    Lampa.TMDB.image = function (url) {
      var base = Lampa.Utils.protocol() + 'image.tmdb.org/' + url;
      return Lampa.Utils.addUrlComponent(filter(Lampa.Storage.field('proxy_tmdb') ? tmdb_proxy.protocol + tmdb_proxy.path_image + url : base), 'email=' + encodeURIComponent(email()));
    };

    Lampa.TMDB.api = function (url) {
      var base = Lampa.Utils.protocol() + 'api.themoviedb.org/3/' + url;
      return Lampa.Utils.addUrlComponent(filter(Lampa.Storage.field('proxy_tmdb') ? tmdb_proxy.protocol + tmdb_proxy.path_api + url : base), 'email=' + encodeURIComponent(email()));
    };

    Lampa.Settings.listener.follow('open', function (e) {
      if (e.name == 'tmdb') {
        e.body.find('[data-parent="proxy"]').remove();
      }
    });
    console.log('TMDB-Proxy', 'started, enabled:', Lampa.Storage.field('proxy_tmdb'));
  
// ****************************************
    Lampa.SettingsApi.addParam({
      component: 'tmdb',
      param: {
        name: 'TMDB-Prox-custom',
        type: 'input',
        values: '',
        default: '',
      },
      field: {
        name: Lampa.Lang.translate('tmdb_prox_custom_lang'),
      }
    });
// ****************************************
})
();
