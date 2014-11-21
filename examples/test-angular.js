
var test = angular.module('test', ['Zupa']);

test.controller('TestCtrl', function($scope){

    $scope.hello = "Hallo, Eivind";

    $scope.paneSettings = {
        pane: {
            west: {
                enabled: true,
                width: 500
            },
            east: {
                enabled: true,
                width: 300
            },
            north: {
                resizable: true,
                enabled: true,
                height: 100
            },
            south: {
                enabled: true,
                height: 200
            }
        }
    };
});