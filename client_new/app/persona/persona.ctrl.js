angular.module('persona.ctrl', [])

  .controller('PersonaTableCtrl', function ($scope, $state, $filter, Apps, Persona) {
    var init;

    Persona.getAll().$promise.then(function (data) {
      $scope.stores = data;

      $scope.searchKeywords = '';
      $scope.filteredStores = [];
      $scope.row = '';
      $scope.select = function (page) {
        var end, start;
        start = (page - 1) * $scope.numPerPage;
        end = start + $scope.numPerPage;
        return $scope.currentPageStores = $scope.filteredStores.slice(start, end);
      };
      $scope.onFilterChange = function () {
        $scope.select(1);
        $scope.currentPage = 1;
        return $scope.row = '';
      };
      $scope.onNumPerPageChange = function () {
        $scope.select(1);
        return $scope.currentPage = 1;
      };
      $scope.onOrderChange = function () {
        $scope.select(1);
        return $scope.currentPage = 1;
      };
      $scope.search = function () {
        $scope.filteredStores = $filter('filter')($scope.stores, $scope.searchKeywords);
        return $scope.onFilterChange();
      };
      $scope.order = function (rowName) {
        if ($scope.row === rowName) {
          return;
        }
        $scope.row = rowName;
        $scope.filteredStores = $filter('orderBy')($scope.stores, rowName);
        return $scope.onOrderChange();
      };
      $scope.numPerPageOpt = [3, 5, 10, 20];
      $scope.numPerPage = $scope.numPerPageOpt[2];
      $scope.currentPage = 1;
      $scope.currentPageStores = [];
      init = function () {
        $scope.search();
        return $scope.select($scope.currentPage);
      };
      return init();
    });
  })

  .controller('PersonaDetailCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $filter, Apps, Persona, PersonaApps) {
    var persona_SEQ = $stateParams.SEQ;
    $scope.availableApps = [];
    $scope.acceptedApps = [];

    Persona.getOne({SEQ: persona_SEQ}).$promise.then(function (data) {
      $scope.persona = data;
    });


    PersonaApps.getWith({persona_SEQ: persona_SEQ}).$promise.then(function (data) {
      var acceptedApps = data;

      Apps.getAll().$promise.then(function (response) {
        var availableApps = response;

        _.each(availableApps, function (each) {
          var accepted = _.findWhere(acceptedApps, {app_SEQ: each.SEQ});
          if (accepted == undefined) {
            each.icon = $rootScope.DB_URL + 'apps/get?SEQ=' + each.SEQ + '&version=' + each.version;
            $scope.availableApps.push(each);
          }
          else {
            accepted.icon = $rootScope.DB_URL + 'apps/get?SEQ=' + each.SEQ + '&version=' + each.version;
            $scope.acceptedApps.push(accepted);
          }
        });
      });
    });


    $scope.dropIntoAvailable = function (data, evt) {
      var index = $scope.availableApps.indexOf(data);
      if (index == -1)
        $scope.availableApps.push(data);
    };

    $scope.dragOutOfAvailable = function (data, evt) {
      var index = $scope.availableApps.indexOf(data);
      if (index > -1) {
        $scope.availableApps.splice(index, 1);
      }
    };

    $scope.dropIntoAccepted = function (data, evt) {
      var index = $scope.acceptedApps.indexOf(data);
      if (index == -1)
        $scope.acceptedApps.push(data);
    };

    $scope.removeApp = function (app, index) {
      console.log(app, index);
      $scope.acceptedApps.splice(index, 1);
      $scope.availableApps.push(app);
    };

  })

  .controller('PersonaNewCtrl', function ($scope, $rootScope, $timeout, $modal, Apps, PersonaApps, Persona, PersonaNew) {

    $scope.form = {
      usuario: null,
      contrasena: null,
      nombre: null,
      apellido: null,
      titulo: null,
      nacido: null,
      lastLogin: null,
      numLogin: null,
      RFID_card: null,
      RFID_PIN: null
    };

    var original = angular.copy($scope.form);


    $scope.availableApps = [];
    $scope.acceptedApps = [];


    Apps.getAll().$promise.then(function (response) {
      $scope.availableApps = response;

      angular.forEach($scope.availableApps, function (each) {
        each.icon = $rootScope.DB_URL + 'apps/get?SEQ=' + each.SEQ + '&version=' + each.version;
      });
    });


    // Drop functionality

    $scope.dropIntoAvailable = function (data, evt) {
      var index = $scope.availableApps.indexOf(data);
      if (index == -1)
        $scope.availableApps.push(data);
    };

    $scope.dragOutOfAvailable = function (data, evt) {
      var index = $scope.availableApps.indexOf(data);
      if (index > -1) {
        $scope.availableApps.splice(index, 1);
      }
    };

    $scope.dropIntoAccepted = function (data, evt) {
      var index = $scope.acceptedApps.indexOf(data);
      if (index == -1)
        $scope.acceptedApps.push(data);
    };

    $scope.removeApp = function (app, index) {
      console.log(app, index);
      $scope.acceptedApps.splice(index, 1);
      $scope.availableApps.push(app);
    };


    // form validation

    $scope.canRevert = function () {
      return !angular.equals($scope.form, original) || !$scope.form_user.$pristine;
    };

    $scope.canSubmit = function () {
      return $scope.form_user.$valid && !angular.equals($scope.form, original);
    };


    // clean up form
    $scope.revert = function () {
      $scope.form = angular.copy(original);
      return $scope.form_user.$setPristine();
    };


    // submit form
    $scope.saveUser = function (user) {

      var modalInstance = $modal.open({
        templateUrl: "userModal.html",
        controller: ModalCtrl,
        resolve: {
          form_user: function () {
            return user;
          },
          form_apps: function () {
            return $scope.acceptedApps;
          }
        }
      });

      modalInstance.result.then(function (first, apps) {
        console.log(first);
        console.log(apps);

        Persona.newPersona(user).$promise.then(function (success) {
          console.log(success);
        });
        $scope.revert();
      });
    };


  });

var ModalCtrl = function ($rootScope, $scope, $modalInstance, form_user, form_apps) {
  $scope.user = form_user;
  $scope.acceptedApps = form_apps;


  $scope.ok = function () {
    $modalInstance.close($scope.user, $scope.acceptedApps);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss("cancel");
  };
};
