/*global angular*/
'use strict';

angular
	.module('tutsplus')
	.controller('homeCtrl', ['$rootScope', 'userService',
		function ($rootScope, userService) {
			var homeModel = this;
			homeModel.isLogged = userService.isLogged();

			$rootScope.$watch('user', function (newVal) {
				homeModel.user = newVal;
				homeModel.isLogged = userService.isLogged();
			}, true);

			homeModel.signUp = function () {
				userService.login();
			};

			homeModel.logout = function () {
				userService.logout();
			};
		}
	]);