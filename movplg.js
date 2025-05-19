(function () {
    'use strict';
    function movplg(src) {

    const originalFunc = Lampa.ParentalControl.personal;
    Lampa.ParentalControl.personal = function(...args) {
        
        const result = originalFunc.apply(this, args);
        
        setTimeout(() => {
            const $parent = $('[data-component="plugins"]').parent();
            $('[data-component="plugins"]').prependTo($parent);
            // const $parent = $('[data-component="plugins"]').parent();
            // const $firstChild = $parent.children().first();
            // $('[data-component="plugins"]').insertAfter($firstChild);
        }, 50);
        
        return result;
    };

    }

if (window.appready) {
    movplg();
}
else {
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
            movplg();
        }
    });
}

})
();
