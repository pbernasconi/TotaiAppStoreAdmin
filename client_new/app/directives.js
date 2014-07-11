angular.module('app.directives', [])

  .directive('capitalizeFirst', function (uppercaseFilter) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var capitalize = function (inputValue) {
          var capitalized = inputValue.charAt(0).toUpperCase() +
            inputValue.substring(1);
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]);
      }
    };
  });
