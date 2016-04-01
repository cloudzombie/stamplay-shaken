/*global angular, $*/
'use strict';

angular
	.module('stakepool')
	.controller('profileCtrl', ['$rootScope', 'userService',
		function ($rootScope, userService) {
			var profileModel = this;

			$rootScope.$watch('user', function (newVal) {
				profileModel.user = newVal;

				if (newVal) {
					if (newVal.get('address')) {
						profileModel.address = profileModel.user.get('address').address;
						profileModel.city = profileModel.user.get('address').city;
						profileModel.zipcode = profileModel.user.get('address').zipcode;
					} else {
						profileModel.user.set('address', {});
					}
				}
			}, true);

			profileModel.unsubscribe = function ($event, planId) {
				$($event.currentTarget).prop('disabled', 'disabled');

				userService.unsubscribe(planId)
					.then(function () {
						profileModel.user.get('subscriptions');
					});
			};

			profileModel.saveData = function ($event) {
				$($event.currentTarget).prop('disabled', 'disabled');
				userService.saveAddress(profileModel.address, profileModel.city, profileModel.zipcode)
					.then(function () {
						$($event.currentTarget).removeProp('disabled');
					});
			};
		}
	]);
