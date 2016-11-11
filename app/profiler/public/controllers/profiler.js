var FCC = angular.module('FCC', ['ngSanitize','ui.bootstrap'])
.controller("profilerController", function( $scope, $http,utilities,DialogService,$window,$timeout) {

var _isDirty =  null;
$scope.user = {}
$scope.questionnaire = {}
$scope.answerCollection = [];

$scope.paginationQuest = {};
$scope.paginationQuest.maxSize= 10; 
$scope.paginationQuest.CurrentPage=1;
$scope.page; 
$scope.progressvalue = 0;


 $scope.pageChanged = function(page){
         $scope.currentQuest = $scope.questionnaire[page -1];
         //console.log(page);
     }; 

 $scope.init =  function(){
    $http.get('/ws/profiler/getsurvey').success(function(resp){
           $scope.user = resp.user || {};
           $scope.questionnaire = resp.questionnaire || {}
           $scope.currentQuest = $scope.questionnaire[0]; 
    });

    $timeout(function(){               
        $("#pageloadingbounce").remove();
        $("#main_app_wrapper").css("visibility","visible");
    });
 };


 $scope.setSingleAnswer =  function(a,b){
     if(!$scope.answerCollection[b._id]){
            $scope.answerCollection[b._id] = a;
     }else{
         $scope.answerCollection[b._id] = a;
     }

     $("#questionnaire_pane").removeClass("fadeInRight");     

     $timeout(function(){
         var _cp = $scope.paginationQuest.CurrentPage
         if( _cp<$scope.questionnaire.length){
                _cp+=1;
                $scope.currentQuest = $scope.questionnaire[_cp -1];                
                $scope.paginationQuest.CurrentPage+=1;
                $("#questionnaire_pane").addClass("fadeInRight");

             
         }
         
         if($scope.questionnaire.length ==$scope.answerCount()){
             var $target = $('html,body'); 
            $target.animate({scrollTop: $target.height()}, 1000);
         }

         $scope.progressvalue = Math.round(($scope.answerCount() / $scope.questionnaire.length) * 100)   

         _isDirty = true;

     },200);
     
 }

 $scope.faqs = function(){
      window.location = "faqs";
}
 $scope.answerCount =  function(){
     return utilities.ObjSize($scope.answerCollection);
 }

$scope.continue = function(){
     window.location = "/";
}


 $scope.submit =  function(){
     var _answerSize = $scope.answerCount();
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
