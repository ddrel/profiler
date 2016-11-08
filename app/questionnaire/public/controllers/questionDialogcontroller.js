FCC.controller('questDialogController', ['$scope','$rootScope', '$modalInstance','$http','questDialogDataService','utilities',
    function ($scope, $rootScope,$modalInstance,$http ,questDialogDataService,utilities) {      

       $scope.paginationQuest = {};
       $scope.paginationQuest.maxSize= 5; 
       $scope.paginationQuest.CurrentPage=1;
       $scope.page; 

      var newRowItem = function(){ return {"value":"A",text:"",default:false}};  

      
      $scope.init = function(){
            $scope.initAdd = questDialogDataService.get().selQuest==null;
            $scope.selectedEvent = questDialogDataService.get().selEvent;
            $scope.currentQuest = questDialogDataService.get().selQuest;
            console.log( $scope.selectedEvent);
            if(!$scope.currentQuest){
                    var _index = ($scope.selectedEvent.questionnaire.items || []).length;
                    $scope.currentQuest = {_id:utilities.uuid(),index:_index,title:"",items:[],type:"single",isnew:true};
                    $scope.currentQuest.items.push(new newRowItem());                    
            }else{
                var key = $scope.currentQuest._id;
                var _index = $scope.selectedEvent.questionnaire.map(function(d){return d._id}).indexOf(key);
                    $scope.paginationQuest.CurrentPage = (_index + 1);
            }
      };
   
      $scope.removeItem = function(item,index){
        $scope.currentQuest.items.splice(index,1);
        for(var i=0;i<$scope.currentQuest.items.length;i++){
                $scope.currentQuest.items[i].value = String.fromCharCode(65 + i);
        }
      };

     $scope.pageChanged = function(page){
         $scope.currentQuest = $scope.selectedEvent.questionnaire[page -1];
         console.log(page);
     }; 



      

    $scope.addItem = function(){
          const nItem = new newRowItem();
          var c = nItem.value.charCodeAt(0) + $scope.currentQuest.items.length;
          var nc = String.fromCharCode(c);
          nItem.value=nc;
          $scope.currentQuest.items.push(nItem);
    }

    /* Dialog Buttons Action*/

    $scope.saveCreate = function(){
        $scope.save(function(){
            $scope.init();
        });        
    };  


    $scope.save = function(cb){
        //New item 
        if($scope.currentQuest.isnew){
            delete $scope.currentQuest.isnew;     
            $scope.selectedEvent.questionnaire.push($scope.currentQuest);
        };


        $http.post('/ws/events/save', $scope.selectedEvent)
          .success(function(resp){
              if(cb){
                  toastr.success("Question successfully added...")
                  cb(resp)
                }else{
                  $modalInstance.close( resp );
              }               
          })
          .error(function(resp){
              if( resp && resp.code == 11000 ){
                  toastr.error('Question name is already used.', 'Error');
              } else {
                  toastr.error('Failed to save Questionnaire.', 'Error');
              }
          });
    }    

    $scope.cancel =  function() {
          $modalInstance.dismiss('Dismiss create group dialog instance.');
    };
}])