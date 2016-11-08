'use strict';
FCC.controller("usersHomeController", function( $scope, $http,$rootScope,DialogService,$timeout,utilities) {
$scope.init =  function(){
    $http.get("/ws/users/getall").success(function(resp){
        $scope.users = resp;
        //console.log($scope.users);
    }).error(function(resp){
            
    });
}
$scope.updateRoles =  function(user){
    var roles = user.roles.indexOf("ADMIN")>-1?"USER":"ADMIN";
    var _user = {}
        _user._id = user._id;
        _user.roles = [roles];
    $http.post("/ws/users/updateroles",_user).success(function(resp){
        user.roles = [roles];
         toastr.success("Successfully update roles");
    }).error(function(resp){
            toastr.error("Failed to update roles....");
    });
}

$scope.deleteuser =  function(user,index){
    var confirmDialog = DialogService.confirm('Are you sure you want to delete ' +user.name+ '?');
        confirmDialog.result.then(function (something) {
            $http.delete('/ws/users/delete?_id='+user._id).success(function(resp){
                $scope.users.splice(index,1);
            });
        });
}

});