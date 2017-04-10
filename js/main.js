(function($, window, document) {
    $("document").ready(function() {
        var width = $('.don-slider').width();
        $( ".don-slider" ).donSlider({
            width:width
        });
        $(window).on('resize',function (event) {
            var slider = $(".don-slider").data('plugin_donSlider');
            if (slider) {
                slider.resize();
            }
        })
    });

}(window.jQuery, window, document));
