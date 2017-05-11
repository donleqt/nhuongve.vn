var module = angular.module('myApp',[
    'ui.router'
]);
module.config(['$stateProvider','$httpProvider','$urlRouterProvider','$locationProvider', function($stateProvider,$httpProvider,$urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url: "/",
            data: {pageTitle: 'Home'},
            templateUrl: "/home.html",
            controller: "HomeController"
        })
        .state('search', {
            url: "^/search",
            data: {pageTitle: 'Home'},
            templateUrl: "/search.html",
            controller: "SearchController",
            params: {
                condition: null
            }
        })
        .state('post_ticket', {
            url: "^/post-ticket",
            data: {pageTitle: 'Home'},
            templateUrl: "/post-ticket.html",
            controller: "PostTicketController"
        })
}]);