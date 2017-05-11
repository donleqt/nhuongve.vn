myApp.controller('PostTicketController', function ($scope, $state, $rootScope, $http) {
    /**
     * Plain js and jquery function
     */
    if (!$rootScope.user) {
        $rootScope.openLogin();
    }
});