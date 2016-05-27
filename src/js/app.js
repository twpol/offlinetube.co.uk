define([
	'library/angular/angular',
	'library/angular-route/angular-route',
	'library/angulartics/dist/angulartics.min',
	'library/angulartics/dist/angulartics-ga.min',
	'library/angulartics/dist/angulartics-piwik.min',
	'templates',
	'controllers/index',
	'controllers/contribute',
	'controllers/network',
	'controllers/line',
	'controllers/station',
	'controllers/route',
	'controllers/plan'
], function (
	angular,
	_angularRoute_,
	_angulartics_,
	_angulartics_ga_,
	_angulartics_piwik_,
	_templates_,
	indexController,
	contributeController,
	networkController,
	lineController,
	stationController,
	routeController,
	planController
) {
	return angular.module('TubeApp', [
		'ngRoute',
		'angulartics',
		'angulartics.google.analytics',
		'angulartics.piwik',
		'templates-template'
	])
		.controller('IndexController', indexController)
		.controller('ContributeController', contributeController)
		.controller('NetworkController', networkController)
		.controller('LineController', lineController)
		.controller('StationController', stationController)
		.controller('RouteController', routeController)
		.controller('PlanController', planController)
		.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'html/index.html',
					controller: 'IndexController'
				})
				.when('/contribute', {
					templateUrl: 'html/contribute.html',
					controller: 'ContributeController'
				})
				.when('/network/:network', {
					templateUrl: 'html/network.html',
					controller: 'NetworkController'
				})
				.when('/network/:network/line/:line', {
					templateUrl: 'html/line.html',
					controller: 'LineController'
				})
				.when('/network/:network/line/:line/station/:station', {
					templateUrl: 'html/station.html',
					controller: 'StationController'
				})
				.when('/network/:network/station/:station', {
					templateUrl: 'html/station.html',
					controller: 'StationController'
				})
				.when('/network/:network/line/:line/route/:route', {
					templateUrl: 'html/route.html',
					controller: 'RouteController'
				})
				.when('/network/:network/plan', {
					templateUrl: 'html/plan.html',
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