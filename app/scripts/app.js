'use strict';

var monitorApp = angular.module('monitorApp', ["monitor.services"])
    .config(['$routeProvider', function($routeProvider) {
	console.log("here")
	$routeProvider
	    .when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl'
	    })
	    .when("/watchdog", {
		templateUrl: "views/watchdog.html",
		controller: "WatchdogCtrl"
	    })
	    .otherwise({
		redirectTo: '/'
	    });
    }]);
