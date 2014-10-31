
var zupa = angular.module('Zupa', []);


/**
 * ZUPA PANE
 */
zupa.directive('zupaPanes', function(){
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: null,
        template: '<div class="gui-panes" ng-transclude><span>Test</span></div>',

        link: function(scope, element, attrs){

        }
    }
});

zupa.directive('zupaPane', function(){
    return {
        restrict: 'EA',
        require: ''
        replace: true,
        transclude: true,
        scope: null,
        template: '<div class="gui-panes" ng-transclude><span>Test</span></div>',

        link: function(scope, element, attrs){

        }
    }
});