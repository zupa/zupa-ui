
var app = angular.module('app', ['ngRoute', 'Zupa']);



/**
 * ROUTES
 */
app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.
        when('/table', { templateUrl: 'table/table.tpl.html' }).
        otherwise({redirectTo: '/'});

}]);




/**
 * APP CONTROLLER
 */
app.controller('AppCtrl', function($scope){

    // Main pane settings
    $scope.paneSettings = {
        pane: {
            center: {
                parent: true
            },
            north: {
                resizable: true,
                enabled: true,
                height: 70
            }
        },
        padding: 0
    };

    // Main menu settings
    $scope.mainMenuSettings = {
        buttons: [{
            label: "Elements",
            menu: [{
                label: "Products"
            },
                {
                    label: "Services"
                },
                {
                    label: "Sectors"
                },
                {
                    label: "Projects"
                }]
        },
        {
            label: "Companies",
            link: "#/"
        },
        {
            label: "Orders",
            link: "#/table"
        }]
    }

});