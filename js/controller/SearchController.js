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
    vm.loading = false;
    rvm.page = 'page-search';
    var doSearchAndFilter = function (condition) {
        condition = condition || {};
        vm.loading = true;
        rvm.getData('tickets',1000)
            .then(function (tickets) {
                /*Get filter*/
                vm.results = tickets.filter(function (item,idz) {
                    if (    (rvm.locations[condition.from] && rvm.locations[condition.from].name !== item.from )
                        ||  (rvm.locations[condition.to] && rvm.locations[condition.to].name !== item.to)) {
                        return false;
                    }
                    if(condition.date && item.begin_date !== helper.getDateString(condition.date,'dd/mm/yyyy')) {
                        return false;
                    }
                    return true;
                });
                vm.loading = false;
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
        //GA for click button event search ticket
        ga('send', 'event', {
            eventCategory: 'Search ticket',
            eventAction: 'click button',
            eventLabel: 'btSearch'
        });
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
    vm.loading = true;
    rvm.getData('locations')
        .then(function (list) {
            rvm.locations = list;
            $rootScope.locations = list;
            var data = [
                {
                    id:'all',
                    text:'Tất cả'
                }
            ];
            data = data.concat(list.map(function (city,idz) {
                return {
                    id: idz,
                    text: city.name
                }
            }));
            $('.select2-location2').select2({
                placeholder: 'Chọn tỉnh/thành phố',
                data:data
            });
            if (!$state.params.condition) {
                rvm.getData('tickets')
                    .then(function (tickets) {
                        vm.loading = false;
                        vm.results = tickets;
                        vm.$apply();
                    });
            }
            else {
                vm.loading = false;
                setTimeout(function () {
                    $('.search-box').formApply($state.params.condition);
                },300);
                doSearchAndFilter($state.params.condition);
                vm.preset = $state.params.condition;
            }
        });
});