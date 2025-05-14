(function () {
    'use strict';
    function bb123(src) {
        const overrideCSS = `
        .items-line--type-top .items-cards .card:nth-child(1),
        .items-line--type-top .items-cards .card:nth-child(2),
        .items-line--type-top .items-cards .card:nth-child(3) {
          margin-left: 0 !important;
        }
        .items-line--type-top .items-cards .card:nth-child(1)::before,
        .items-line--type-top .items-cards .card:nth-child(2)::before,
        .items-line--type-top .items-cards .card:nth-child(3)::before {
          content: none !important;
        }
      `;
        const styleTag = document.createElement("style");
        styleTag.textContent = overrideCSS;
        document.head.appendChild(styleTag);
    }

    //'./ext/axis2.svg',
    if (window.appready) {
        bb123();
    }
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                bb123();
            }
        });
    }
})();
