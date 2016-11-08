FCC.controller('eventsDialogController', ['$scope', '$modalInstance','$http','eventsDialogDataService',
    function ($scope, $modalInstance,$http,eventsDialogDataService ) {      
      
  $scope.events= eventsDialogDataService.get() || {}; 
       $scope.save = function(){
         $('.i-checksEvent').iCheck('update');
         $scope.events.event_date = new Date($( "#eventDate" ).datepicker( "getDate" ));
         $http.post('/ws/events/save', $scope.events)
          .success(function(resp){
              eventsDialogDataService.set({});  
              $modalInstance.close( resp );
          })
          .error(function(resp){
              if( resp && resp.code == 11000 ){
                  toastr.error('Events name is already used.', 'Error');
              } else {
                  toastr.error('Failed to save Events.', 'Error');
              }
          });
       }

      $scope.init = function(){
         $("#eventDate").datepicker();
         if($scope.events.event_date){
            $( "#eventDate" ).datepicker( "setDate", new Date($scope.events.event_date));
         };

         var ischeck = $scope.events.active?'check':'uncheck';
         $('.i-checksEvent').iCheck(ischeck);

         $('.i-checksEvent').on('ifChecked', function(event){
            $scope.events.active = true;
        })
        .on('fUnchecked', function(event){
            $scope.events.active = false;
        })
      };
      // function if cancel button
      $scope.cancel = function () {
          eventsDialogDataService.set({});
          $modalInstance.dismiss('Dismiss create group dialog instance.');
      };
}])