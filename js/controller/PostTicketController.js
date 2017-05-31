'use strict'
window.myApp.controller('PostTicketController', function ($scope, $state, $rootScope, initService) {
    var toastr = window.toastr;
    $rootScope.user = $rootScope.user || 1;

    /**
     * Plain js and jquery function
     */
    initService.run('PostTicketController',function () {
        $('#ticketForm').validate({
            rules: {
                from: {
                    required: true
                },
                to: {
                    required: true
                },
                passenger: {
                    required: true
                },
                begin_date: {
                    required: true
                },
                transporter: {
                    required: true
                },
                carrier: {
                    required: true
                },
                price: {
                    required: true,
                    value: 0
                },
                image: {
                    required:true
                }
            },
            ignore: ' ',
            messages: {
                from: {
                    required: 'Vui lòng nhập điểm đi'
                },
                to: {
                    required: 'Vui lòng nhập điểm đến'
                },
                passenger: {
                    required: 'Vui lòng nhập tên hành khách'
                },
                begin_date: {
                    required: 'Vui lòng chọn ngày khởi hành'
                },
                transporter: {
                    required: 'Vui lòng chọn loại vé'
                },
                carrier: {
                    required: 'Vui lòng nhập hãng vận chuyển'
                },
                price: {
                    required: 'Vui lòng nhập giá',
                    value: 0
                },
                image: {
                    required:'Vui lòng cung cấp ít nhất 1 hình ảnh'
                }
            },
            submitHandler: function (form) {
                return false;
            }
        });
    });
    if (!$rootScope.user) {
        toastr.warning('Bạn cần đăng nhập để thực hiện đăng vé.');
        $rootScope.openLogin();
    }
    /**
     * Angular
     *
     */
});