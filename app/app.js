var app = angular.module('myApp', ['ngRoute' , 'ngTouch', 'ui.grid']);
app.factory("services", ['$http', function($http) {
//   https://docs.angularjs.org/guide/providers

    var serviceBase = 'services/'
    var obj = {};

    obj.getCustomers = function(){
        return $http.get(serviceBase + 'customers');
    }

    //    query parameter/angular route of customer ID passed to $routeParams
    obj.getCustomer = function(customerID){
        return $http.get(serviceBase + 'customer?id=' + customerID);
    }

    obj.insertCustomer = function (customer) {
    return $http.post(serviceBase + 'insertCustomer', customer).then(function (results) {
        return results;
    });
    
	};

	obj.updateCustomer = function (customer) {
	    return $http.post(serviceBase + 'updateCustomer', {id:customer.customerNumber, customer:customer}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteCustomer = function (id) {
	    return $http.delete(serviceBase + 'deleteCustomer?id=' + id).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('listCtrl', function ($scope, $rootScope, $location, $routeParams, services) {

      $scope.newcustomer = {};

      services.getCustomers().then(function(data){
          $scope.customers = data.data;
      });

      $scope.refresh = function() {
            services.getCustomers().then(function(data){
                $scope.customers = data.data;
            });
      }

      $scope.isClean = function() {
        return angular.equals(original, $scope.customer);
      }

      $scope.deleteCustomer = function(customer, $index) {
        if(confirm("Are you sure to delete customer number: "+customer.customerNumber)==true)
        services.deleteCustomer(customer.customerNumber).then(function($data){
          $scope.customers.splice($index, 1);
        },function($err){
          
        })
      };

      $scope.insertCustomer = services.insertCustomer;

      $scope.updateCustomer = services.updateCustomer;

  
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, customer) {
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
    $rootScope.title = (customerID > 0) ? 'Edit Customer' : 'Add Customer';
    $scope.buttonText = (customerID > 0) ? 'Update Customer' : 'Add New Customer';
      var original = customer.data;
      original._id = customerID;
      $scope.customer = angular.copy(original);
      $scope.customer._id = customerID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.customer);
      }

      $scope.deleteCustomer = function(customer) {
        $location.path('/');
        if(confirm("Are you sure to delete customer number: "+$scope.customer._id)==true)
        services.deleteCustomer(customer.customerNumber);
      };

      $scope.saveCustomer = function(customer) {
        $location.path('/');
        if (customerID <= 0) {
            services.insertCustomer(customer);
        }
        else {
            services.updateCustomer(customerID, customer);
        }
    };
});

app.controller('uiGridCtrl', function ($scope, services) {
    services.getCustomers().then(function(data){
        $scope.customers = data.data;
    });


  // add form validation to existing ui
  // add create functionality to ui grid
  // add update functionality to ui grid
  // add delete functionality to ui grid
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'Customers',
        templateUrl: 'partials/customers.html',
        controller: 'listCtrl'
      })
      .when('/edit-customer/:customerID', {
        title: 'Edit Customers',
        templateUrl: 'partials/edit-customer.html',
        controller: 'editCtrl',
        resolve: {
          customer: function(services, $route){
            var customerID = $route.current.params.customerID;
            return services.getCustomer(customerID);
          }
        }
      })
      .when('/uigrid', {
          templateUrl : 'partials/uigrid.html',
          controller  : 'uiGridCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      //$locationProvider.html5Mode(true);
}]);
// app.run(['$location', '$rootScope', function($location, $rootScope) {
//     $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
//         $rootScope.title = current.$$route.title;
//     });
// }]);