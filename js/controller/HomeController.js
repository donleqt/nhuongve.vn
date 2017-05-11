myApp.controller('HomeController', function ($scope, $state, $rootScope, $http) {
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
    $rootScope.getData('locations')
        .done(function (list) {
            $rootScope.locations = list;
        });
    var vm = $scope;
    vm.search = function () {
        var params = $('.search-box').serializeObject();
        console.log(params);
        $state.go('search',{condition:params});
    }
});