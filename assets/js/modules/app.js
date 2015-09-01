/*global angular*/
'use strict';

angular.module('tutsplus', ['tutsplus.service', 'ngRoute', 'ui.router', 'ngStamplay']);

angular
	.module('tutsplus')
	.config(function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '/pages/home.html',
				controller: 'homeCtrl',
				controllerAs: 'home'
			})
			.state('subscriptions', {
				url: '/subscriptions',
				templateUrl: '/pages/subscriptions.html',
				controller: 'subscriptionCtrl',
				controllerAs: 'sub'
			})
			.state('profile', {
				url: '/profile',
				templateUrl: '/pages/profile.html',
				controller: 'profileCtrl',
				controllerAs: 'profile'
			});
	})
	/* 
	 * Save logged user, if present, in the rootScope
	 */
	.run(['$rootScope', 'userService',
		function ($rootScope, userService) {
			userService.getUserModel()
				.then(function (userResp) {
					$rootScope.user = userResp;
				});
		}
	]);