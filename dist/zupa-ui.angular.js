
var zupa = angular.module('Zupa', []);


/**
 * ZUPA PANE
 * Wrapper
 */
zupa.directive('zupaPanes', function($rootScope){
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

            $rootScope.$on('$routeChangeSuccess', function (event, current, previous, rejection) {
                console.log("SET VIEW MAN");
            });
        }
    }
});


/**
 * ZUPA MAIN MENU
 * Wrapper
 */
zupa.directive('zupaMainMenu', function(){
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            settings: '='
        },
        link: function(scope, element, attrs){

            $(element).zupaMainMenu(scope.settings);
        }
    }
});


/**
 * ZUPA TABLE
 * Wrapper
 */
zupa.directive('zupaTable', function(){
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            settings: '='
        },
        link: function(scope, element, attrs){

            $(element).zupaTable(scope.settings);
        }
    }
});