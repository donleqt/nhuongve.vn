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
    var defaultFilter = {
        minPrice: '',
        maxPrice: '',
        time: 'all',
        ticketType: 'all'
    };
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
    vm.resetResult  = function () {
        if (vm.applyFilter.list) {
            vm.results = vm.applyFilter.list;
            vm.applyFilter.list = null;
        }
    };
    vm.results = null;
    vm.applyFilter = function () {
        vm.resetResult();
        var filter = $('.filter-box').serializeObject();
        vm.applyFilter.list = vm.results;
        vm.results =  vm.results.filter(function (ticket,idz) {
            if (filter.ticketType !== 'all' && filter.ticketType !== ticket.transporter) {
                return false;
            }
            if ((filter.maxPrice && parseInt(filter.maxPrice) < parseInt(ticket.price)) ||  (filter.minPrice && parseInt(filter.minPrice) > parseInt(ticket.price))) {
                return false;
            }
            return true;
        });
    };
    vm.resetFilterBox = function () {
        $('.filter-box').formApply(defaultFilter);
        if (vm.applyFilter.list) {
            vm.results = vm.applyFilter.list;
            vm.applyFilter.list = null;
        }
    };
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
        doSearchAndFilter($('.search-box').serializeObject());
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
            toastr.warning('Bạn cần đăng nhập để thực hiện đặt vé.');
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