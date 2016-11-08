(function(){
var app = angular.module("LoginModule",[]);
  app.controller("LoginController", function( $scope, $http,$rootScope) {
      $scope.user= {}      
      $scope.user.email = "";
      $scope.user.password = "";
      $scope.loginError = "";

      /**
       * Use to pass the credentials
       */
       $scope.login = function() {
        $http.post('/login', {
          email: $scope.user.email,
          password: $scope.user.password
        })
        .success(function(response) {
            // authentication OK
            $scope.loginError = "";
            $rootScope.user = response.user;
           // $cookieStore.put('user',response.user);
           // UserSession.setUser( response.user );
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function() {            
            $scope.loginError = 'Authentication failed.';
            //console.log($scope.loginError);
          });
       }
  
  });
})();