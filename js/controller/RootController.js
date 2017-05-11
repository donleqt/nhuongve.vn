var helper = {
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
    },
    getDateString : function(date, format){
        date = new Date(date);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            getPaddedComp = function(comp) {
                return ((parseInt(comp) < 10) ? ('0' + comp) : comp)
            },
            formattedDate = format,
            o = {
                "y+": date.getFullYear(), // year
                "M+": months[date.getMonth()], //month
                "m+": getPaddedComp(date.getMonth()+1 ), //month
                "d+": getPaddedComp(date.getDate()), //day
                "h+": getPaddedComp((date.getHours() > 12) ? date.getHours() % 12 : date.getHours()), //hour
                "H+": getPaddedComp(date.getHours()), //hour
                "i+": getPaddedComp(date.getMinutes()), //minute
                "s+": getPaddedComp(date.getSeconds()), //second
                "S+": getPaddedComp(date.getMilliseconds()), //millisecond,
                "b+": (date.getHours() >= 12) ? 'PM' : 'AM'
            };

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                formattedDate = formattedDate.replace(RegExp.$1, o[k]);
            }
        }
        return formattedDate;
    },
    stringToDate : function(_date,_format,_delimiter){
        var formatLowerCase=_format.toLowerCase();
        var formatItems=formatLowerCase.split(_delimiter);
        var dateItems=_date.split(_delimiter);
        var monthIndex=formatItems.indexOf("mm");
        var dayIndex=formatItems.indexOf("dd");
        var yearIndex=formatItems.indexOf("yyyy");
        var month=parseInt(dateItems[monthIndex]);
        month-=1;
        var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
        return formatedDate;
    },
    beautyNumber: function (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    }
};
var myApp = angular.module('myApp');

myApp.controller('RootController', function ($scope, $state, $rootScope, $http) {
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
    helper.init();

    /**
     * Angular
     */
    var root = window.root = $rootScope;
    window.getData = root.getData = function (name) {
        return $.getJSON('/data/'+name+'.json')
            .fail(function (err) {
                console.log("Can't connect to loading data:\n");
            });
    };

    root.page = '';
    $(document).on('click','.signup-invite',function () {
        $('.popup-login').modal('hide');
        $('.popup-signup').modal('show');
    });
    $(document).on('click','.login-invite',function () {
        $('.popup-login').modal('show');
        $('.popup-signup').modal('hide');
    });
    $('.popup-login').on('hide.bs.modal',function () {
        $(this).find('form')[0].reset();
        root.loginError = '';
    });
    root.openLogin = function () {
        $('.popup-login').modal('show');
    };
    root.getData('users')
        .done(function (users) {
            users.forEach(function (user, idz) {
                users[user.email] = user;
            });
            root.users = users;
        });
    root.login = function () {
        var data = $('#loginForm').serializeObject();
        root.loginError='';
        if (data.email) {
            if (root.users[data.email]) {
                console.log(root.users[data.email]);
                console.log(data.password);
                if (root.users[data.email].password === data.password) {

                    root.user = root.users[data.email];
                    $('.popup-login').modal('hide');
                }
                else {
                    root.loginError = 'Sai mật khẩu!';
                }
            }
            else {
                root.loginError = 'Không có tài khoản này';
            }
        }
        else {
            root.loginError = 'Vui lòng nhập email';
        }
    }



});