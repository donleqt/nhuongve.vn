myApp.controller('HomeController', function ($scope, $state, $rootScope, $http) {
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
    $rootScope.pageLoad = true;
    $rootScope.getData('locations')
        .then(function (locations) {
            $rootScope.locations = locations;
            $rootScope.pageLoad = false;
            $scope.$apply();
        });
    vm.search = function () {
        var params = $('.search-box').serializeObject();
        $state.go('search',{condition:params});
    }
});