FCC.controller("questController", function( $scope,utilities, $http,$rootScope,questDialogService,DialogService,questDialogDataService) {
    $scope.eventsCollection = [];
    $scope.action="";

    $scope.init = function(){
         $http.get('/ws/events/getall').success(function(resp){
            $scope.eventsCollection = resp;
        });   
    }

 
    $scope.onEventsChange = function(){
        console.log($scope.selectedEvent);
        questDialogDataService.set({selQuest:null,selEvent:$scope.selectedEvent});
    }


    $scope.updatequestionnaire = function(obj){ 
        questDialogDataService.set({selQuest:obj,selEvent:$scope.selectedEvent});      
        var questDialog= questDialogService.loadDialog();
        questDialog.result.then(function(resp){
            
        });
    }
       
     $scope.deleteItem = function(obj,index){
             var confirmDialog = DialogService.confirm('Are you sure you want to delete "' + obj.title+ '"?');
              confirmDialog.result.then(function (something) {
                  $http.delete('/ws/events/questionnaire/delete?event_id='+ $scope.selectedEvent._id +"&question_id="+obj._id).success(function(resp){
                      $scope.selectedEvent.questionnaire.splice(index,1);
                  }).error(function(err){
                      toastr.error("Failed to delete question!");
                  });
              });
      };
      $scope.addquestionnaire = function(){ 
        questDialogDataService.set({selQuest:null,selEvent:$scope.selectedEvent});      
        var questDialog= questDialogService.loadDialog();
        questDialog.result.then(function(resp){
            
        });
     }

})