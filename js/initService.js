/**
 * Created by Don Le on 5/29/2017.
 */
angular.module('myApp').factory('initService',function () {
    var self = {};
    self.runned = {};
    self.run = function (name, cb) {
        name = name || 'default';
        if (!self.runned[name] && typeof cb === 'function') {
            cb();
            // self.runned[name] = true;
        }
    };
    return self;
});