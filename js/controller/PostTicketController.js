myApp.controller('PostTicketController', function ($scope, $state, $rootScope, $http) {
    /**
     * Plain js and jquery function
     */
    if (!$rootScope.user) {
        toastr.warning('Bạn cần đăng nhập để thực hiện đăng vé.');

        $rootScope.openLogin();
    }
});