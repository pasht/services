/**
 * Created by administrator on 3/4/16.
 */
define(['angular'],function(angular){
    var filters = angular.module('services.Filters',[]);

    filters
        .filter("format", function () {
            return function (input) {
                var args = arguments;
                return input.replace(/\{(\d+)\}/g, function (match, capture) {
                    return args[1*capture + 1];
                });
            };
        });

})
