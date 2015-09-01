/*global angular, $, console*/
'use strict';

angular
	.module('tutsplus')
	.controller('subscriptionCtrl', ['$rootScope', '$location', '$anchorScroll', '$timeout', 'userService',
		function ($rootScope, $location, $anchorScroll, $timeout, userService) {
			var subModel = this;
			subModel.saveAddress = true;
			subModel.address = (subModel.user && subModel.user.get('address')) ? subModel.user.get('address') : {};

			subModel.showThankyou = false;
			subModel.showPayment = false;

			subModel.selectedPlanMap = {
				tplanOne: 'God save the queen',
				tplanTwo: 'From kentucky with love',
				tplanThree: 'The rum diary'
			};

			/*
			 *	Create a Stripe demo test card
			 */
			subModel.card = {
				number: '4242424242424242',
				expM: '12',
				expY: '2026',
				cvc: '989'
			};

			subModel.isLogged = userService.isLogged();

			$rootScope.$watch('user', function (newVal) {
				subModel.user = newVal;
				subModel.isLogged = userService.isLogged();
				subModel.address = (subModel.user && subModel.user.get('address')) ? subModel.user.get('address') : {};
			}, true);

			subModel.login = function () {
				userService.login();
			};

			subModel.openSubscribe = function (planId) {
				subModel.showPayment = true;
				subModel.showThankyou = false;

				subModel.selectedPlanName = subModel.selectedPlanMap[planId];
				subModel.selectedPlanId = planId;

				//Scroll to payment
				$timeout(function () {
					$location.hash('payment-form');
					$anchorScroll();
				});
			};

			subModel.subscribe = function ($event) {
				$($event.currentTarget).prop('disabled', 'disabled');

				if (subModel.saveAddress) {
					userService.saveAddress(subModel.address.address, subModel.address.city, subModel.address.zipcode);
				}

				userService.createCard({
						number: subModel.card.number,
						exp_month: subModel.card.expM,
						exp_year: subModel.card.expY,
						cvc: subModel.card.cvc
					})
					.then(function () {
						return userService.subscribe(subModel.selectedPlanId);
					})
					.then(function () {
						subModel.showPayment = false;
						subModel.showThankyou = true;
						$($event.currentTarget).removeProp('disabled');
					}).catch(function (err) {
						$($event.currentTarget).removeProp('disabled');
						console.log(err);
					});
			};

			subModel.toggleSaveAddress = function () {
				subModel.saveAddress = !subModel.saveAddress;
			};
		}
	]);