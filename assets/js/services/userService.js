/*global angular, Stripe, console*/
'use strict';

angular
	.module('stakepool.service')
	.factory('userService', ['$q', '$stamplay',
		function ($q, $stamplay) {
			var user = $stamplay.User().Model;

			return {
				login: function () {
					return user.login('facebook');
				},

				logout: function () {
					return user.logout();
				},

				isLogged: function () {
					return user.isLogged();
				},

				saveAddress: function (address, city, zipcode) {
					var saveUser = $stamplay.User().Model;
					user.set('address', {
						address: address,
						city: city,
						zipcode: zipcode
					});

					saveUser.set('address', user.get('address'));
					saveUser.set('_id', user.get('_id'));

					return saveUser.save();
				},

				getUserModel: function () {
					var def = $q.defer();

					user.currentUser()
						.then(function () {
							//create a stripe customer if doesn't exist
							if (user.isLogged()) {
								if (!user.get('stripeCustomerId')) {
									$stamplay.Stripe().createCustomer(user.get('id'))
										.then(function (sResponse) {
											var saveUser = $stamplay.User().Model;
											user.set('stripeCustomerId', sResponse.customer_id);
											user.set('subscriptions', sResponse.subscriptions);

											saveUser.set('stripeCustomerId', user.get('stripeCustomerId'));
											saveUser.set('subscriptions', user.get('subscriptions'));
											saveUser.set('_id', user.get('_id'));

											saveUser.save()
												.then(function () {
													def.resolve(user);
												});
										})
								} else {
									def.resolve(user);
								}
							} else {
								def.resolve(user)
							}
						})
						.catch(function (err) {
							def.reject(err);
						});

					return def.promise;
				},

				createCard: function (cardObj) {
					var def = $q.defer();
					var $stripe = $stamplay.Stripe();

					$stripe.getCreditCard(user.get('id'))
						.then(function (response) {
							var nDef = $q.defer();
							if (response.card_id) {
								nDef.resolve();
							} else {
								Stripe.card.createToken(cardObj, function (err, response) {
									var token = response.id;
									$stamplay.Stripe().createCreditCard(user.get('id'), token)
										.then(function (response) {
											nDef.resolve(response);
										})
										.catch(function (err) {
											nDef.reject(new Error(err));
										});
								});
							}

							return nDef.promise;
						})
						.then(function () {
							def.resolve();
						})
						.catch(function (err) {
							console.log(err);
						});

					return def.promise;
				},

				subscribe: function (planId) {
					var def = $q.defer();

					$stamplay.Stripe().createSubscription(user.get('id'), planId)
						.then(function () {
							return $stamplay.Stripe().getSubscriptions(user.get('id'));
						})
						.then(function (response) {
							user.set('subscriptions', response.data);
							var saveUser = $stamplay.User().Model;

							saveUser.set('subscriptions', user.get('subscriptions'));
							saveUser.set('_id', user.get('_id'));

							saveUser.save()
								.then(function () {
									def.resolve();
								});
						})
						.catch(function (err) {
							console.log(err);
							def.reject(err);
						});

					return def.promise;
				},

				unsubscribe: function (planId) {
					var def = $q.defer();

					$stamplay.Stripe().deleteSubscription(user.get('id'), planId)
						.then(function () {
							return $stamplay.Stripe().getSubscriptions(user.get('id'));
						})
						.then(function (response) {
							user.set('subscriptions', response.data);
							var saveUser = $stamplay.User().Model;

							saveUser.set('subscriptions', user.get('subscriptions'));
							saveUser.set('_id', user.get('_id'));

							saveUser.save()
								.then(function () {
									def.resolve();
								});
						})
						.catch(function (err) {
							console.log(err);
							def.reject(err);
						});

					return def.promise;
				}

			};
		}
	]);
