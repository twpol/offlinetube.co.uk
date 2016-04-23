/// <reference path="../typings/angularjs/angular.d.ts"/>
define([
	'library/angular/angular',
	'library/angular-route/angular-route',
	'library/angulartics/dist/angulartics.min',
	'library/angulartics/dist/angulartics-ga.min',
	'library/angulartics/dist/angulartics-piwik.min',
	'templates',
	'controllers/index',
	'controllers/network',
	'controllers/line',
	'controllers/station',
	'controllers/route',
	'controllers/plan'
], function (
	_angular_,
	_angularRoute_,
	_angulartics_,
	_angulartics_ga_,
	_angulartics_piwik_,
	_templates_,
	indexController,
	networkController,
	lineController,
	stationController,
	routeController,
	planController
) {
	angular.module('TubeApp', [
		'ngRoute',
		'angulartics',
		'angulartics.google.analytics',
		'angulartics.piwik',
		'templates-template'
	])
		.controller('IndexController', indexController)
		.controller('NetworkController', networkController)
		.controller('LineController', lineController)
		.controller('StationController', stationController)
		.controller('RouteController', routeController)
		.controller('PlanController', planController)
		.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'html/index.jade',
					controller: 'IndexController'
				})
				.when('/network/:network', {
					templateUrl: 'html/network.jade',
					controller: 'NetworkController'
				})
				.when('/network/:network/line/:line', {
					templateUrl: 'html/line.jade',
					controller: 'LineController'
				})
				.when('/network/:network/line/:line/station/:station', {
					templateUrl: 'html/station.jade',
					controller: 'StationController'
				})
				.when('/network/:network/station/:station', {
					templateUrl: 'html/station.jade',
					controller: 'StationController'
				})
				.when('/network/:network/line/:line/route/:route', {
					templateUrl: 'html/route.jade',
					controller: 'RouteController'
				})
				.when('/network/:network/plan', {
					templateUrl: 'html/plan.jade',
					controller: 'PlanController'
				});
			$locationProvider.html5Mode(true);
		}])
		.run(['$rootScope', '$timeout', '$document', '$rootElement', function ($rootScope, $timeout, $document, $rootElement) {
			$rootScope.$on('$viewContentLoaded', function () {
				$timeout(function () {
					$document[0].title = $rootElement.find('h1').text();
				});
			});
		}]);
});