define(['angular'],function(angular){
    var directives = angular.module('services.Directives',[]);

    // Format a string as in Java's StringFormatter or C's printf
    function format (args) {
        var newStr = this;
        for (var key in args) {
            newStr = newStr.replace('{' + key + '}', args[key]);
        }
        return newStr;
    }

    /**
     * Covert string back to Camel Case
     * @param name
     * @returns {string}
     */
    function camelCase(name) {
        return name.charAt(0).toUpperCase()+name.slice(1);
    };


    /**
     * Generic Ajax call pattern
     *
     * @author Paschalis Thriskos
     * @param config - Object describing the request to be made and how it should be processed (@link https://docs.angularjs.org/api/ng/service/$http)
     * @param action - Object containing ajax actions and callbacks
     * @constructor
     */
    function ajaxCall(config,actions){
        this.config = config;
        this.actions = actions;
        // $q must have been injected into the Service
        this.defered = $q.defered;
        // $http must have been injected into the Service
        $http(config)
            .then(this.actions.success,this.actions.error);
        return this.defered;


    }

    /******************************************************
     * @author Paschalis Thriskos <pthriskos@mnec.gr>
     * @returns {{require: string, link: Function}}
     * @constructor
     */
    function PwCheck(){
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        };
    }
    /****************************************************************
        Show validation feedback to the user
        Use it ONLY for Bootstrap
        Created by: Paschalis Thriskos
        Date      : 19/04/2016
     ****************************************************************/

    // Inject dependencies
    uiValidation.$inject = ['$compile'];
    // Directive definition
    function uiValidation ($compile){
        //Messages used in UI directive
        var messages ={
            required  : 'Κενό πεδίο',
            minlength : 'Το λιγότερο {0} χσρσκτήρες',
            maxlength : 'Το περισσότερο {0} χαρακτήρες',
            number    : 'Πρέπει να καταχωρήσετε αριθμό',
            email     : 'Πρέπει να καταχωρήσετε κάποια δ/σνη ηλ. ταχυδρομείου',
            date      : 'Πρέπει να καταχωρήσετ ημερμηνία'
        };
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {},
            link: function (scope, element, attributes, ngModel) {
                // Add watcher
                scope.$watch(
                    function(){
                        return ngModel.$invalid;
                    },
                    function(invalid) {
                        var $parent = $(element).parent();
                        $element = $(element);

                        if (!invalid) {
                            // Adjust width
                            var $icon = $parent.find('span.glyphicon-remove');
                            $element.animate({width: '+='+$icon.width()+'px'},200);
                            $parent
                                .find('span.input-group-addon')
                                .animate({right: '0'},200);
                            // Remove element
                            $parent
                                .removeClass('has-error', 'has-feedback')
                                .find('span.form-control-feedback')
                                .remove();
                            return;

                        }
                        if (!ngModel.$dirty)
                            return;
                        // Add parent classes
                        $parent.addClass('has-error', 'has-feedback');

                        // Add glyphicon
                        var $icon = $('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
                        $parent.append($icon);
                        $icon.css({
                            //'right': "-" + $icon.width() + "px",
                            'pointer-events': 'auto',
                            'cursor': 'pointer'
                        });

                        // And tooltip
                        var msg = 'No message';
                        for( key in ngModel.$error){
                            msg = attributes['ui-'+key];
                            break;
                        }
                        // And tooltip
                        $icon.tooltip({
                            title : 'Το μήκος του πεδίου είναι μικρότερο από 6 χαρακτήρες',
                            placement : attributes.uiPlacement,
                            template : '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="background-color: #a94442"></div></div>'
                        });

                        //Adjust width
                        $element.animate({width: '-='+$icon.width()+'px'},200);
                        $parent
                            .find('span.input-group-addon')
                            .css({'position' : 'relative'})
                            .animate({right: $icon.width()+'px'},200);


                    }
                );
            }
        };
    }

    // Map
    function map() {
        return {
            restrict:'E',
            link: _maplink,
            controller: MapController,
            scope: { url: '=url'}
        }
        function MapConroller(){
            ajaxCall({ url: '/services/data/dimoi.topojson'
            })
        }
        function _maplink(scope, elem, attrs){

        }
    }


    directives
        // Directive to validate field content against another
        .directive('pwCheck',PwCheck)
        .directive('uiValidation',uiValidation)
        .directive('map',map);

    return directives;

});