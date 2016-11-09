var FCC = angular.module('FCC', ['ngSanitize','ui.bootstrap','ui.sortable'])
.controller("doneController", function( $scope, $http,$rootScope,utilities,DialogService,$window) {

    $scope.user = {};
    $scope.questionnaire = {};
    $scope.answer = {};
    $scope.init =  function(){
    
    $http.get('/ws/profiler/getprofileranswer').success(function(resp){
        $scope.user = resp.user || {};
        $scope.questionnaire = resp.questionnaire || {}
        $scope.answer = resp.answer || [] 

        console.log(resp);
	    });
    };

    $scope.getanswer =  function(a){
            var _idx = $scope.answer.map(function(d){return d.question_id}).indexOf(a);
            if(_idx>-1){
                var c = $scope.answer[_idx].answer;
                return c.value + ". " + c.text;  
            }
    };

});
