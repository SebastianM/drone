'use strict';

angular.module('app').controller("RepoController", function($scope, $http, $routeParams, $route, repos, feed, repo) {
	$scope.repo = repo;

	// subscribes to the global feed to receive
	// build status updates.
	// todo(sebastianm): use $rootScope events in feed service to get rid of $scope.$apply() here
	feed.subscribe(function(item) {
		if (item.repo.host  == repo.host  &&
			item.repo.owner == repo.owner &&
			item.repo.name  == repo.name) {
			// display a toast message with the
			// commit details, allowing the user to
			// reload the page.
			$scope.msg = item;
			$scope.$apply();
		} else {
			// we trigger a toast (or html5) notification so the
			// user is aware another build started

		}
	});


	// load the repo commit feed
	repo.customGET('feed').then(function (feed) {
		$scope.commits = (typeof feed==='string')?[]:feed;
		$scope.state = 1;
	}, function (error) {
		$scope.commits = undefined;
		$scope.state = 1;
	});

	//$http({method: 'GET', url: '/v1/repos/'+repo.host+'/'+repo.owner+"/"+repo.name+"/feed"}).
	//	success(function(data, status, headers, config) {
	//		$scope.commits = (typeof data==='string')?[]:data;
	//	}).
	//	error(function(data, status, headers, config) {
	//		console.log(data);
	//	});

	$scope.activate = function() {
		// request to create a new repository
		repo.post().then(function(repo) {
			$scope.repo = repo;
			delete $scope.failure;
		}, function() {
			$scope.failure = data;
		});
	};


	$scope.reload = function() {
		$route.reload();
	};

	//$scope.activate = function() {
	//	repos.activate($scope.host, $scope.name).success(function () {
	//			window.location.href="/admin/users";
	//		})
	//		.error(function (error) {
	//			console.log(error);
	//		});
	//};

})

.controller('RepoConfigController', ['$scope', '$routeParams', 'user', 'repos', function($scope, $http, $routeParams, user, repos) {
	$scope.user = user;

	// load the repo meta-data
	// request admin details for the repository as well.
	// todo(sebastianm): move this in route resolve block, cause this is needed for displaying a useful page
	var repo = repos.getOneByHostOwnerName($routeParams.remote, $routeParams.owner, $routeParams.name).withAdminDetails();

	repo.then(function(data) {
		$scope.repo = data;
	}, function(data) {
		// todo(sebastianm): add better error handling
		console.error(data);
	});

	$scope.save = function() {
		// request to create a new repository
		$scope.repo.put().then(function() {
			delete $scope.failure;
		}, function(data) {
			$scope.failure = data;
		});
	};
}]);