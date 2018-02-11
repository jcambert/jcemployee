angular
    .module('PresenceApplication', ['ngMaterial', 'ds.clock', 'sailsResource', 'toastr'])
    .constant('appConfig', {
        id: 'PresenceApplication'
    })

.controller('presenceController', ['$scope', function($scope) {}])
    .controller('stateController', ['$rootScope', '$scope', 'Employee', 'Pointage', function($rootScope, $scope, Employee, Pointage) {
        $rootScope.$on('$sailsResourceCreated', function(event, message) {
            if (message.model == 'employee') {

                $scope.employees.unshift(message.data);
            }
            console.dir(message);
            //$scope.$apply();

        });
        $rootScope.$on('$sailsResourceDestroyed', function(event, message) {
            if (message.model == 'employee') {
                _.remove($scope.employees, { id: message.data.id });
            }
            console.dir(message);
        });
        $rootScope.$on('$sailsResourceUpdated', function(event, message) {
            // $scope.$apply();
            console.dir(message);
            if (message.model == 'employee') {
                var idx = _.findIndex($scope.employees, { id: message.data.id });
                $scope.employees.splice(idx, 1, message.data);
            }
        });
        Employee.query(function(employees) {
            $scope.employees = employees;
        });
    }])
    .controller('pointageController', ['$rootScope', '$scope', 'Employee', 'Pointage', function($rootScope, $scope, Employee, Pointage) {

        $rootScope.$on('$sailsResourceCreated', function(event, message) {
            if (message.model == 'pointage') {

                $scope.pointages.unshift(message.data);
            }
            console.dir(message);
            //$scope.$apply();

        });
        $rootScope.$on('$sailsResourceDestroyed', function(event, message) {
            if (message.model == 'pointage') {
                _.remove($scope.pointages, { id: message.data.id });
            }
            console.dir(message);
        });
        $rootScope.$on('$sailsResourceUpdated', function(event, message) {
            // $scope.$apply();
            console.dir(message);
            if (message.model == 'pointage') {
                var idx = _.findIndex($scope.pointages, { id: message.data.id });
                $scope.pointages.splice(idx, 1, message.data);
            }
        });

        $scope.title = "Présence";
        $scope.user = {};
        $scope.onBadgeEnter = function() {
            //alert($scope.user.badge);
            Employee.byBadge({ badge: $scope.user.badge },
                function(employee) {
                    $scope.employee = employee;
                    console.dir(employee);
                    Pointage.forEmployee({ employee: employee.id },
                        function(pointages) {
                            $scope.pointages = pointages;
                        },
                        function(err) {
                            console.dir(err);
                        });
                },
                function(err) { console.dir(err); });
        };
    }])
    .controller('configController', ['$rootScope', '$scope', function($rootScope, $scope) {

    }])
    .controller('employeeController', ['$rootScope', '$scope', 'Employee', 'toastr', function($rootScope, $scope, Employee, toastr) {
        Employee.query(
            function(employees) {
                $scope.employees = employees;
            },
            function(error) {
                toastr.error(error);
            });
        $scope.isSolde = function(employee) {
            if (!$scope.solde) return !employee.solde;
            return true;
        };
        $scope.removeEmployee = function(index) {
            var e = $scope.employees[index];
            e.$remove(function() {
                toastr.success(e.prenom + ' a été supprimé');
            });
        };
        $scope.soldeEmployee = function(index) {
            var e = $scope.employees[index];
            e.solde = true;
            e.$save(function() {
                toastr.success(e.prenom + ' a été soldé');
            });
        };

    }])

.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .factory('Employee', ['sailsResource', function(res) {
        return res('Employee', {
            byBadge: {
                method: 'GET',
                isArray: false,
                url: '/employee/bybadge/:badge',
                params: { badge: "@badge" }
            }
        });
    }])
    .factory('Pointage', ['sailsResource', function(res) {
        return res('Pointage', {
            forEmployee: {
                method: 'GET',
                isArray: true,
                url: '/pointage/for/:employee',
                params: { employee: '@employee' }
            }
        });
    }])
    .run(['$rootScope', '$window', 'toastr', 'appConfig', function($rootScope, $window, toastr, appConfig) {
        console.log('Presence Application running');
        io.socket.get('/welcome', { appid: appConfig.id }, function(resData, jwres) {
            toastr.success('You are now registered to realtime update');
            console.dir(resData);
        });

        $rootScope.$on('$sailsConnected', function() {

            io.socket.on('welcome', function(data) {
                console.log(data.greeting);
                io.socket.on('pointage:created', function(data) {
                    console.dir(data);
                });
                io.socket.on('pointage:updated', function(data) {
                    console.dir(data);
                });
            });


        });

        $rootScope.go = function(location) {
            alert(location);
            $window.location.href = location;
        }



    }])

;