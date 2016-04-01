/*global angular*/
'use strict';

angular.module('stakepool', ['stakepool.service', 'ngRoute', 'ui.router', 'ngStamplay']);

angular
	.module('stakepool')
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
