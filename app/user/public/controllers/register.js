(function(){
var app = angular.module("RegisterModule",[]);

  app.controller("RegisterController", function( $scope,$rootScope, $http ) {
      $scope.processing = true;
      $scope.user = {};
      $scope.registerError = [];      
      $scope.Register = function(){
           $http.post('/register', {
            email: $scope.user.email,
            password: $scope.user.password,
            confirmPassword: $scope.user.confirmPassword,
            name: $scope.user.name,
            })
          .success(function() {
            // authentication OK
            $scope.registerError = [];
            window.location.href="/login";            
          })
          .error(function(error) {
            if (error === 'Email already taken') {
               $scope.emailError = error;
            } else $scope.registerError = error;            
          });

        
        
      };

      
  });

})();