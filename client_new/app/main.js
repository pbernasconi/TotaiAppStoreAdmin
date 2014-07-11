angular.module('app.controllers', [])

  .controller('AppCtrl', function ($scope, $state, $location) {
    $scope.isSpecificPage = function () {
      var path;
      path = $location.path();
      return _.contains(['/404', '/pages/500', '/login', '/pages/signin', '/pages/signin1', '/pages/signin2', '/pages/signup', '/pages/signup1', '/pages/signup2', '/pages/lock-screen'], path);
    };

    return $scope.main = {
      brand: 'Flatify',
      name: 'Lisa Doe'
    };
  });