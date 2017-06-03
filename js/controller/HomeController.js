myApp.controller('HomeController', function ($scope, $state, $rootScope, gaService) {
    var vm = $scope;
    $rootScope.page = 'page-home';
    /**
     * Plain js and jquery function
     */
    var inputDate = document.getElementById('timePicker');
    rome(inputDate,{time:false,min:new Date()});
    /**
     * Angular
     *
     */
    $rootScope.getData('locations',1)
        .then(function (locations) {
            $rootScope.locations = locations;
            var data = [
                {
                    id:'all',
                    text:'Tất cả'
                }
            ];
            data = data.concat(locations.map(function (city,idz) {
                return {
                    id: idz,
                    text: city.name
                }
            }));
            $('.select2-location2').select2({
                placeholder: 'Chọn tỉnh/thành phố',
                data:data
            });
            $scope.$apply();
        });
    vm.search = function () {
        var params = $('.search-box').serializeObject();
        gaService.event('Search tickets','Click search button from home page', 'Search from home');
        $state.go('search',{condition:params});
    };
    gaService.page('Home');
});