var FCC = angular.module('FCC', ['ngSanitize','ui.bootstrap','ui.sortable','chart.js'])
.controller("profilerController", function( $scope, $http,utilities,DialogService,$window) {

var _isDirty =  null;
$scope.user = {}
$scope.questionnaire = {}
$scope.answerCollection = [];


 $scope.init =  function(){
    $http.get('/ws/profiler/getsurvey').success(function(resp){
           $scope.user = resp.user || {};
           $scope.questionnaire = resp.questionnaire || {} 
    });
 };


 $scope.setSingleAnswer =  function(a,b){
     if(!$scope.answerCollection[b._id]){
            $scope.answerCollection[b._id] = a; 
     }else{
         $scope.answerCollection[b._id] = a;
     }
 }     


 $scope.submit =  function(){
     var _answerSize = utilities.ObjSize($scope.answerCollection);
    if(($scope.questionnaire.length != _answerSize)  && _answerSize>0){
         _isDirty = true;
         toastr.error("List question should not be blanked!");
     }else if(($scope.questionnaire.length == _answerSize)  && _answerSize>0){
            _isDirty=null;
            var _transport = [];
                for(var key in $scope.answerCollection){
                        var _data = {}
                            _data.question_id = key;
                            _data.answer = {};
                            _data.answer.text = $scope.answerCollection[key].text;
                            _data.answer.value = $scope.answerCollection[key].value;
                            _data.answer.default = $scope.answerCollection[key].default;
                            _transport.push(_data);
                };
        $http.post('/ws/profiler/save',{data:_transport}).success(function(resp){
            window.location.href=window.location.href;
        }).error(function(err){
            console.log(err);
        })
                
     }

     $scope.questionnaire.forEach(function(el) {
            var a = $scope.answerCollection[el._id]; 
            var b = a?"btn btn-primary dim":"btn btn-warning  dim";            
            var c = a? "<i class='fa fa-check'></i>":"<i class='fa fa-warning'></i>";
            $("#" + el._id).removeClass();
            $("#" + el._id).addClass(b);
            $("#" + el._id).empty().append(c);

            if(!a){                
                toastr.warning(el.title);
            }
     });
 }


 $scope.checkDataDirty =  function(){
     return _isDirty;
 }

window.onbeforeunload = function(e){

    alert(e);
var message = "Some of your changes has not yet been saved, Do you want to leave the page?"
            e = e || window.event;            
            if(_isDirty){
                if( e.hasOwnProperty("preventDefault")){
                    e.preventDefault();
                }

                if (e) {
                    e.returnValue = message;
                };           
                   
            }
            return _isDirty;            
};


});
