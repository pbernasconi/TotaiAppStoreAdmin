angular.module('apps.ctrl', [])

  .controller('AppsTableCtrl', function ($scope, $rootScope, $state, $filter, $timeout, Apps) {

    $scope.searchKeywords = '';
    $scope.filteredStores = [];
    $scope.row = '';
    $scope.numPerPageOpt = [3, 5, 10, 20];
    $scope.numPerPage = $scope.numPerPageOpt[2];
    $scope.currentPage = 1;
    $scope.currentPageStores = [];
    $scope.selected = 0;


    $scope.buttons = [
      {name: 'table view', index: 0},
      {name: 'grid view', index: 1}
    ];

    Apps.getAll().$promise.then(function (data) {
      $scope.stores = data;
      $scope.gridStores = data;

      angular.forEach(data, function (each) {
        $timeout(function () {
          each.icon = $rootScope.DB_URL + 'apps/get?SEQ=' + each.SEQ + '&version=' + each.version;
        })
      });

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

      $scope.gridStores.range = function () {
        var range = [];
        for (var i = 0; i < $scope.gridStores.length; i = i + 4)
          range.push(i);
        return range;
      };

      init = function () {
        $scope.search();
        return $scope.select($scope.currentPage);
      };
      return init();
    });


    $scope.selectBtn = function (index) {
      $scope.selected = index;
      switch (index) {
        case 0:
          break;
        case 1:
          break;
      }
    };

  })


  .controller('AppsDetailCtrl', function ($scope, $stateParams, $rootScope, $state, $timeout, Apps) {
    var apps_SEQ = $stateParams.SEQ;

    Apps.getOne({SEQ: apps_SEQ}).$promise.then(function (data) {
      $scope.app = data;
      console.log(data.SEQ);
      console.log(data.version);

      $timeout(function () {
        $scope.app.icon = $rootScope.DB_URL + 'apps/get?SEQ=' + data.SEQ + '&version=' + data.version;
      })
    })
  })


  .controller('AppsUploadCtrl', function ($scope, $rootScope, $state, $timeout, $upload, WizardHandler, Apps) {

    var iconFile = null;
    var plistFile = null;
    var ipaFile = null;

    $scope.newApp = {
      nombre: null,
      detaille: null,
      device: null,
      OS: null,
      OS_version: null,
      version: null,
      version_antigua: null,
      bundle_identifier: null,
      icon: null,
      version_fecha_hora: null,
      versiona_antigua_fecha_hora: null
    };
    var newAppOriginal = angular.copy($scope.newApp);


    $scope.newAppAmazon = {
      app_SEQ: null,
      nombre: null,
      amazon_bucket: null,
      amazon_filename: null,
      url: null,
      version: null,
      fecha_hora: null
    };


    Apps.getAll().$promise.then(function (data) {
      $scope.availableApps = data;
    });

    $scope.selectUpdateApp = function (selectedApp) {
      $scope.newApp = selectedApp;
    };

    $scope.select = function (type) {
      switch (type) {
        case 'app':
          $scope.uploadType = 'app';
          $scope.newApp = angular.copy(newAppOriginal);
          break;
        case 'version':
          $scope.uploadType = 'version';
          $scope.newApp = angular.copy(newAppOriginal);
          break;
      }
    };

    $scope.canRevert = function (form) {
      return !angular.equals($scope.newApp, newAppOriginal) || !form.$pristine;
    };

    $scope.canSubmit = function (form) {
      return form.$valid && !angular.equals($scope.newApp, newAppOriginal) && $scope.newApp.icon != null;
    };

    $scope.onNombreChange = function () {
      if ($scope.newApp.nombre != undefined) {
        $scope.newApp.nombre = $scope.newApp.nombre.charAt(0).toUpperCase() + $scope.newApp.nombre.substring(1).toLowerCase();
        $scope.newApp.bundle_identifier = 'com.totaicitrus.' + $scope.newApp.nombre;
      } else {
        $scope.newApp.nombre = null;
        $scope.newApp.bundle_identifier = null;
      }
    };


    /*
     uploadNewApp(iconFile, app);

     Apps.newApp(app).$promise.then(function (data) {
     console.log(data);
     WizardHandler.wizard().next();

     });
     */


    function uploadNewApp(file, newApp) {
      $scope.upload = $upload
        .upload({
          url: $rootScope.DB_URL + 'apps/X',
          method: 'POST',
          data: newApp,
          file: file
        })
        .progress(function (evt) {
          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        })
        .success(function (data, status) {
          console.log(data, status);
        })
        .error(function (error) {
          console.log(error);
        });
    }

    $scope.iconSelect = function ($file) {
      iconFile = $file;
      if (window.FileReader && $file[0].type.indexOf('image') > -1) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL($file[0]);

        fileReader.onload = function (e) {

          $timeout(function () {
            $scope.newApp.icon = e.target.result;
          });
        }
      }


    };


    $scope.plistFileSelect = function ($file) {
      plistFile = $file;
      var fileReader = new FileReader();
      fileReader.readAsText($file[0]);

      fileReader.onload = function (e) {
        var plist = new PlistParser(e.target.result);

        var res = plist.parse();
        console.log(res);

        $timeout(function () {
          $scope.plistUpload = true;
          $scope.assets = res.items[0].assets;
          $scope.metadata = res.items[0].metadata;
        });
      }
    }

    $scope.ipaFileSelect = function ($file) {
      ipaFile = $file;

      $timeout(function () {
        $scope.ipaUpload = true;
      });
    }
  });