var pureBase = {
    init: function () {
        if (!$.fn.serializeObject) {
            $.fn.serializeObject = function () {
                var o = {};
                var a = this.serializeArray();
                $.each(a, function () {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            };
        }
        if (!$.fn.loadOn) {
            $.fn.loadOn = function () {
                this.block({
                    message: '<div class="loading"></div>',
                    css: {
                        border: 'none',
                        width: '14px',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.4,
                        cursor: 'wait'
                    }
                });
            };
        }
        if (!$.fn.loadOff) {
            $.fn.loadOff = function () {
                this.unblock();
            };
        }
        if (!$.fn.formApply) {
            $.fn.formApply = function (data) {
                var form = this[0];
                var input = null;
                var val = null;
                if (form && data) {
                    Object.keys(data).map(function (key) {
                        input = form[key];
                        val = data[key];
                        if (input) {
                            if (input.type === 'checkbox' || input.type === 'radio') {
                                input.checked = !!val;
                            }
                            else {
                                input.value = val;
                            }
                        }
                    });
                }
                return this;

            }
        }
        $(document).on('click', 'a[data-toggle="tab"]', function (event) {
            event.preventDefault();
        });
        if ($.validator) {
            $.validator.setDefaults({
                errorElement: 'small'
            })
        }
        if ($.fn.select2) {
            $.fn.select2.defaults.set("language", "vi");
        }
        window.isNumber = function (number) {
            if (!isNaN(number)) {
                return number;
            }
            try {
                return parseInt(number);
            }
            catch (e) {
                return false;
            }
        };
        window.toArray = function (item) {
            return $.isArray(item) ? item : [item];
        };
        //imageUploader
        // disable markdown
        window.toMarkdown = function (content) {
            return content;
        };
    }
};

myApp.controller('RootController', function ($scope, $state, $rootScope, $http) {
    console.log('Xin chao tu root');

    /**
     * Plain js and jquery function
     */
    var initHeader = function () {
        var nav = $('header');
        var start_point = 90;

        $(window).scroll(function () {
            var self = $(this);

            if (self.scrollTop() > start_point) {
                nav.addClass("small");}
            else {
                nav.removeClass("small");
            }
        });
    };
    initHeader();
    pureBase.init();

});