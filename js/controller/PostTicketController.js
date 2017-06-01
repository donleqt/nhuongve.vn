'use strict'
window.myApp.controller('PostTicketController', function ($scope, $state, $rootScope, initService) {
    var toastr = window.toastr;
    var vm = $scope;
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
                    required: true
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
                console.log('helen');
                console.log($(form).serializeObject());
                return false;
            }
        });
        $(document).on('change','#image',function () {
            if(this.value) {
                 helper.localPreview(this.files[0])
                    .done(function (data) {
                        vm.previewImage =data;
                        vm.$apply();

                    });
            }
        });
        var d = new Date();
        d.setDate(d.getDate() + 1);
        rome(document.getElementById('beginDate'),{min:d});
        $('#carrier').select2({
            placeholder: 'Chọn hãng xe',
            data: [
                {
                    id: 'Phương Trang',
                    text: 'Phương Trang'
                },
                {
                    id: 'Thành Bưởi',
                    text: 'Thành Bưởi'
                },
                {
                    id: 'Jetstar',
                    text: 'Jetstar'
                },
                {
                    id: 'Vietnam Airline',
                    text: 'Vietnam Airline'
                },
                {
                    id: 'VietJet air',
                    text: 'VietJet air'
                }
            ],
            tags: true
        })
    });

    /**
     * Angular
     *
     */
    if (!$rootScope.user) {
        toastr.warning('Bạn cần đăng nhập để thực hiện đăng vé.');
        $rootScope.openLogin();
    }
    $rootScope.getData('locations')
        .then(function (locations) {
            $('.select2-locations').select2({
                placeholder: 'Chọn điểm đi',
                data: locations.map(function (city,idz) {
                    return {
                        id: idz,
                        text: city.name
                    }
                })
            });
        });
});