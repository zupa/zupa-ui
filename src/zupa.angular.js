
var zupa = angular.module('Zupa', []);


/**
 * ZUPA PANE
 * Wrapper
 */
zupa.directive('zupaPanes', function(){
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<div ng-transclude></div>',
        scope: {
            settings: '='
        },
        link: function(scope, element, attrs){

            $(element).zupaPane(scope.settings);

            scope.$watch('settings', function(){
                $(element).data('zupaPane').updateSettings(scope.settings);
            }, true);
        }
    }
});
