'use strict';
(function(){
    
FCC.controller("eventsController", function( $scope,utilities, $http,$rootScope,eventsDialogService,eventsDialogDataService,DialogService) {
    $scope.eventsCollection = [];
    $scope.add = function(){        
        var eventsDialog = eventsDialogService.loadeventDialog();
        eventsDialog.result.then(function(resp){
            if(resp.type="insert"){
                $scope.eventsCollection.push(resp.data);
            }
        });
    };

    $scope.formatDate = function(d){
        return utilities.formatDate(d);
    }
    
    $scope.formatBool = function(b){
        return utilities.formatBoolToString(b);
    }
    

    $scope.update = function(events){
        eventsDialogDataService.set(events);
        var eventsDialog = eventsDialogService.loadeventDialog();
                eventsDialog.result.then(function(events){    
                    $scope.getAllEvents();            
            });
    };

     $scope.deleteEvent = function(events,index){
             var confirmDialog = DialogService.confirm('Are you sure you want to delete ' +events.title+ '?');
              confirmDialog.result.then(function (something) {
                  $http.delete('/ws/events/delete?_id='+events._id).success(function(resp){
                      $scope.eventsCollection.splice(index,1);
                  });
              });
      };

    $scope.getAllEvents = function(){
        $http.get('/ws/events/getall').success(function(resp){
            $scope.eventsCollection = resp;
        });
    };

    $scope.init =  function(){        
       $scope.getAllEvents();     
    };
})
})();    