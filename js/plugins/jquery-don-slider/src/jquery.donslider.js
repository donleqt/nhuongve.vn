// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "donSlider",
        defaults = {
            indicator: true,
            btnNext: '.btn-next',
            btnPrev: '.btn-prev',
            width:100
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {
        init: function() {
            var self = this;
            var element = $(this.element);
            this.ul =  element.find('ul');
            this.indicator = this.settings.indicator ? element.find('.indicator') : 0;
            if (this.ul.length === 0) {
                throw new Error('donSlider: Wrong DOM slider structure, there is no UL tag');
            }
            this.slideCount = element.find('ul li').length;
            this.slideWidth = this.settings.width;
            this.slideHeight = element.find('ul li').height();
            this.sliderUlWidth = this.slideCount * this.slideWidth;

            console.log('hahah');
            if (this.indicator.length) {
                var indicator = this.indicator;
                indicator.html('');
                for(var i = 1;i<=this.slideCount;i++) {
                    var dot = $('<span class="dot">'+i+'</span>');
                    indicator.append(dot);
                    dot.click((function (id) {
                        return function () {
                            self.goTo(id)
                        }
                    })(i))
                }
                element.find('ul li').each(function (idz,item) {
                    $(item).attr('data-sindex',idz);
                })
            }
            element.find('ul li').css({
                width:this.slideWidth
            });
            element.css({ width: this.slideWidth, height: this.slideHeight });

            this.ul.css({ width: this.sliderUlWidth, marginLeft: - this.slideWidth });

            this.ul.find('li:last-child').prependTo(this.ul);
            this.indicator.find('.dot:first-child').addClass('active');

            element.find(this.settings.btnNext).click(this.goNext.bind(this));
            element.find(this.settings.btnPrev).click(this.goPrev.bind(this));

        },
        goPrev: function(time) {
            time = typeof time === "number" ? time : 300;
            var self = this;
            this.ul.animate({
                left: + this.slideWidth
            }, time, function () {
                self.ul.find('li:last-child').prependTo(self.ul);
                self.ul.css('left', '');
                self.reIndication();
            });

        },
        goNext: function (time) {
            time = typeof time === "number" ? time : 300;
            var self = this;
            this.ul.animate({
                left: - this.slideWidth
            }, time, function () {
                self.ul.find('li:first-child').appendTo(self.ul);
                self.ul.css('left', '');
                self.reIndication();
            });
        },
        reIndication: function () {
            if (this.indicator) {
                this.indicator.find('.active').removeClass('active');
                var index = this.ul.find('li:nth-child(2)').data('sindex');
                this.indicator.find('.dot').eq(index).addClass('active');
            }
        },
        goTo: function (number) {
            if (number>=1&&number <=this.slideCount) {
                var current = this.ul.find('li:nth-child(2)').data('sindex') + 1;
                var distance = number - current;
                var i;
                if ( distance > 0) {
                    for ( i=0;i<distance;i++) {
                        this.goNext(100);
                    }
                }
                else if (distance < 0) {
                    for (i=distance;i<0;i++) {
                        this.goPrev(100);
                    }
                }
            }
        },
        resize: function () {
            $(this.element).css({width:'auto'});
            var newWidth = $(this.element).width();
            if (newWidth && typeof newWidth === 'number') {
                var element = $(this.element);

                this.slideWidth = this.settings.width = newWidth;
                this.sliderUlWidth = this.slideCount * this.slideWidth;

                element.find('ul li').css({
                    width:this.slideWidth
                });
                element.css({ width: this.slideWidth, height: this.slideHeight });
                this.ul.css({ width: this.sliderUlWidth, marginLeft: - this.slideWidth });
            }
        }
    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" +
                    pluginName, new Plugin( this, options ) );
            }
        } );
    };

} )( jQuery, window, document );