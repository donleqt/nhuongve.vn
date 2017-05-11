myApp.controller('SearchController', function ($scope, $state, $rootScope, $http) {
    /**
     * Plain js and jquery function
     */
    var inputDate = document.getElementById('timePicker');
    rome(inputDate, {time: false, min: new Date()});
    /**
     * Angular
     */
    var vm = $scope;
    var rvm = $rootScope;
    vm.preset = null;
    vm.beautyNumber = helper.beautyNumber;
    rvm.page = 'page-search';
    var doSearchAndFilter = function (condition) {
        condition = condition || {};
        rvm.getData('tickets')
            .done(function (tickets) {
                /*Get filter*/
                vm.results = tickets.filter(function (item,idz) {
                    if (    (rvm.locations[condition.from] && rvm.locations[condition.from].name !== item.from )
                        ||  (rvm.locations[condition.to] && rvm.locations[condition.to].name !== item.to)) {
                        return false;
                    }
                    if (condition.date && item.begin_date !== helper.getDateString(condition.date,'dd/mm/yyyy')) {
                        return false;
                    }
                    return true;
                });
                vm.$apply();
            });
    };
    vm.results = null;
    vm.toggleFilterBox = function () {
        var target = $('.filter-box');
        var opt = {
            duration: 300,
            ease: 'swing'
        };
        if (target.css('display') === 'none') {
            target.slideDown(opt);
        }
        else {
            target.slideUp(opt);
        }
    };
    vm.search = function () {
        doSearchAndFilter($('.search-box').serializeObject())
    };
    vm.quickBook = function (ticket) {
        if (rvm.user) {
            swal({
                    title: "Vui lòng xác nhận? ",
                    text: "Bạn muốn đặt tấm vé này. Yêu cầu sẽ được gửi đi",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK, Xác nhận!",
                    closeOnConfirm: false
                },
                function(){
                    swal("Thành công!", "Bạn đã đặt vé thành công, hãy đợi chủ vé liên hệ bạn nhé!", "success");
                    ticket.sold  = true;
                    vm.$apply();
                });
        }
        else {
            rvm.openLogin();
        }
    };
    rvm.getData('locations')
        .done(function (list) {
            rvm.locations = list;
            if (!$state.params.condition) {
                rvm.getData('tickets')
                    .done(function (tickets) {
                        vm.results = tickets;
                        vm.$apply();
                    });
            }
            else {
                setTimeout(function () {
                    $('.search-box').formApply($state.params.condition);

                },10);
                doSearchAndFilter($state.params.condition);
                vm.preset = $state.params.condition;
            }
        });


});