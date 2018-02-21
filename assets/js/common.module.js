angular
  .module('CommonModule', ['sailsResource'])

  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
  .factory('Employee', ['sailsResource', function (res) {
    return res('Employee', {
      byBadge: {
        method: 'GET',
        isArray: false,
        url: '/employee/bybadge/:badge',
        params: {
          badge: "@badge"
        }
      }
    });
  }])
  .factory('Pointage', ['sailsResource', function (res) {
    return res('Pointage', {
      forEmployee: {
        method: 'GET',
        isArray: true,
        url: '/pointage/for/:employee',
        params: {
          employee: '@employee'
        }
      },
      add: {
        url: '/pointage/add',
        
      }
    });
  }])

  .run(['$rootScope', '$window', function ($rootScope, $window) {


    $rootScope.go = function (location) {
      //    alert(location);
      $window.location.href = location;
    }



  }]);
