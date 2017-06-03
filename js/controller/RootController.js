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
        return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';

    },
    /**
     * Local preview image
     *
     * @param file: localfile upload path
     * @return Data binary
     *
     */
    localPreview: function (file) {
        var defer = $.Deferred();
        var fs = new FileReader();
        fs.onload = function (e) {
            defer.resolve(event.target.result);
        };
        fs.readAsDataURL(file);
        return defer;
    }
};
var tempList = {
    users: [],
    locations: [],
    tickets: []
};
var myApp = angular.module('myApp');

myApp.controller('RootController', function ($scope, $state, $rootScope,gaService) {
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
    var back_to_top = function () {
        // Show or hide the sticky footer button
        $(window).scroll(function() {
            if ($(this).scrollTop() > 200) {
                $('.go-top').fadeIn(200);
            } else {
                $('.go-top').fadeOut(200);
            }
        });
        // Animate the scroll to top
        $('.go-top').click(function(event) {
            event.preventDefault();
            $('html, body').animate({scrollTop: 0}, 300);
        });
    };
    back_to_top();
    initHeader();
    helper.init();
    toastr.options = {
        "timeOut": "2000"
    };
    /**
     * Angular
     */
    var root = window.root = $rootScope;
    root.gaService = gaService;
    root.state = $state;
    var getDataLocal =  function (name,time) {
        var delay = time || 0;
        return new Promise(function (resolve, reject) {
            $.getJSON('/data/'+name+'.json')
                .done(function (data) {
                    if(tempList[name]) {
                        data = data.concat(tempList[name]);
                    }
                    setTimeout(function () {
                        resolve(data);
                    },delay);
                });
        });
    };
    var getDataOnline = function (name) {
        return db.ref(name).once('value')
            .then(function (snapshot) {
                return snapshot.val();
            });
    };
    window.getData = root.getData = getDataLocal;

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
    $('.popup-signup').on('hide.bs.modal',function () {
        $(this).find('form')[0].reset();
        root.signupError = '';
    });
    root.openLogin = function () {
        $('.popup-login').modal('show');
    };

    root.fetchUsers = function () {
        root.getData('users')
            .then(function (users) {
                users.forEach(function (user, idz) {
                    users[user.email] = user;
                });
                root.users = users;
            });
    };
    root.fetchUsers();
    root.login = function () {
        var data = $('#loginForm').serializeObject();
        root.loginError='';
        if (data.email) {
            if (root.users[data.email]) {
                if (root.users[data.email].password === data.password) {
                    root.user = root.users[data.email];
                    $('.popup-login').modal('hide');
                    toastr.success('Chào '+root.user.name+', bạn đã đăng nhập thành công!');
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
    };

    $('.login-form').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {
            email: {
                required: 'Vui lòng nhập email',
                email: 'Email không hợp lệ'
            },
            password: {
                required: 'Vui lòng nhập mật khẩu'
            }
        },
        submitHandler: function (form) {
            var data = $(form).serializeObject();
            root.loginError='';
            if (data.email) {
                if (root.users[data.email]) {
                    if (root.users[data.email].password === data.password) {
                        root.user = root.users[data.email];
                        $('.popup-login').modal('hide');
                        toastr.success('Chào '+root.user.name+', bạn đã đăng nhập thành công!');
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
            gaService.event("Login","Click Login button","Do  login");
            root.$apply();
            return false;
        }
    });
    //GA for click button event sign in
    ga('send', 'event', {
        eventCategory: 'Sign in',
        eventAction: 'click button',
        eventLabel: 'btn-signin'
    });
    $('.register-form').validate({
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            name: {
                required: 'Vui lòng nhập họ tên'
            },
            email: {
                required: 'Vui lòng nhập email',
                email: 'Email không hợp lệ'
            },
            password: {
                required: 'Vui lòng nhập mật khẩu',
                minlength: 'Mật khẩu phải trên 5 ký tự'
            }
        },
        submitHandler: function (form) {
            var data = $(form).serializeObject();
            root.signupError = '';
            if (root.users[data.email]) {
                root.signupError = 'Email này đã được sử dụng';
                root.$apply();
            }
            else {
                root.users[data.email] =  {
                    "name": data.name,
                    "avatar": "/img/user4.jpg",
                    "email": data.email,
                    "password": data.password
                };
                tempList.users.push(root.users[data.email]);
                form.reset();
                swal("Chúc mừng!", "Đăng ký thành công !\nBạn đã trở thành thành viên của nhuongve.vn", "success");

            }
            gaService.event("Register","Click register button","Do register");
            return false;

        }
    });

});