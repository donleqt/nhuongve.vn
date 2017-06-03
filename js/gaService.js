/**
 * Created by donleqt on 03/06/2017.
 */
angular.module('myApp').factory('gaService',function () {
    var gaService = {
        page: function (pageName) {
            console.log('Google analytics: Send page ',pageName);
            ga('send','pageview',pageName);
        },
        event: function (category, action, label) {
            label = label || '';
            ga('send', 'event',category, action, label);
            console.log('Google analytics: Send event ',category);
        }
    };
    return gaService;
});