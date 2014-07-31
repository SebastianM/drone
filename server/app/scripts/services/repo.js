'use strict';

angular.module('app').config(['RestangularProvider', function(RestangularProvider) {
	RestangularProvider.addElementTransformer('repos', false, function(repo) {
		repo.addRestangularMethod('withAdminDetails', 'get', undefined, {'admin': 1});
		return building;
	});
}]);

// Service facilitates interaction with the repository API.
angular.module('app').factory('repos', ['Restangular', function(Restangular) {
	var resource = Restangular.all('repos');

	var api = {
		getResource: function() {
			return resource;
		},
		getOneByHostOwnerName: function(host, owner, name) {
			return resource.all(host).all(owner).one(name);
		}
	};

  return api;
}]);