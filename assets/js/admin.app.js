angular
  .module('AdministrationApplication', ['ngMaterial', 'CommonModule', 'toastr'])
  .constant('appConfig', {
    id: 'EmployeeApplication'
  })
  .config([function () {

  }])


  .controller('configController', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $scope.allowClickTitle = true;
  }])
  .controller('employeeEditController', ['$rootScope', '$scope', 'toastr', 'Employee', function ($rootScope, $scope, toastr, Employee) {
    console.dir($scope.id);
    $scope.$watch('id', function (_new, _old) {
      console.dir(_new);
      Employee.byBadge({
          badge: _new
        },
        function (employee) {
          $scope.employee = employee;
          toastr.success('Edition de ' + employee.prenom);
        },
        function (err) {
          toastr.error(err);
        })
    });
  }])

;
