FCC.controller("surveyController", function( $scope, $http,$rootScope,$window,$timeout,fcc_socket) {

$scope.broadcastedQuestion = {};
$scope.answeredQuestion = [];
$scope.isInit=false;
$scope.setMultiAnswer = function(obj,sel){    
        var i = $scope.selectedAnswer.map(function(d){return d.value}).indexOf(obj.value);        
        if(sel && i==-1){
            $scope.selectedAnswer.push(obj);
        }else if(!sel && i>-1){
            $scope.selectedAnswer.splice(i,1);
        }
        //console.log($scope.selectedAnswer);            
}

$scope.setSingleAnswer = function(obj){
    $scope.selectedAnswer=obj;
};

$scope.getbyuseranswer = function(obj,cb){       
       var _data={}
    _data.event_id = $scope.broadcastedQuestion.event_ref;
    _data.question_id = $scope.broadcastedQuestion.question._id;
    $http.get('/ws/answer/getbyuserevent?event_id=' + _data.event_id + "&question_id=" + _data.question_id)
        .success(function(resp){
        cb(resp);
    }).error(function(resp){
        cb(null);
    })         
}

$scope.animate =  function(id){
    $("#" + id)
            .removeAttr('class').attr('class', '')        
            .removeClass('animated')
            .removeClass('slideInRight')
            .addClass('well')
            .addClass('animated')
            .addClass('slideInRight');
            $timeout(function(){
                $("#" + id)
                .removeClass('animated')
                .removeClass('slideInRight');
            },1000); 

}

//redering workaround
$scope.setDisplayTemplate = function(id){
     $("#questionnaire_template").css("display","none");
     $("#answeredquestion_template").css("display","none");
    if(id=="questionnaire_template"){
        $("#questionnaire_template").css("display","block");
        $("#answeredquestion_template").css("display","none");
    }else{
        $("#questionnaire_template").css("display","none");
        $("#answeredquestion_template").css("display","block");
    }
    
    $scope.animate(id);
}

$scope.modifyAnswer = function(){
    $scope.answeredQuestion=null;
    $scope.setDisplayTemplate("questionnaire_template");
    $scope.selectedAnswer = ($scope.broadcastedQuestion.question.type=="multi")? []:null;
    $(".i-question").prop('checked', false);            
}
$scope.getBroadcastQuestion = function(){
    $http.get('/ws/published/getpublished').success(function(resp){
        $scope.broadcastedQuestion = resp || {};
        $scope.getbyuseranswer(resp,function(obj){
            if(!obj){
                 $scope.answeredQuestion =  null;
                 $scope.setDisplayTemplate("questionnaire_template");                    
            }else{
                $scope.answeredQuestion = obj;
                $scope.setDisplayTemplate("answeredquestion_template");
                $scope.txtanswer = ($scope.broadcastedQuestion.question.type=="free") ?$scope.answeredQuestion.answer:"";
            }
        });
        $scope.selectedAnswer = ($scope.broadcastedQuestion.question.type=="multi")? []:null;
    });
}

$scope.ontextChange= function(txt){    
    $scope.selectedAnswer=txt;
}

$scope.sendanswer = function(item){
    if(!$scope.selectedAnswer) return;
    if($scope.selectedAnswer.length==0) return;
    
    var _data = {};
        _data.event_id = $scope.broadcastedQuestion.event_ref;
        _data.event_ref = $scope.broadcastedQuestion.event_ref;
        _data.question_id = $scope.broadcastedQuestion.question._id;
        _data.answer = $scope.selectedAnswer;  
    
    $http.post('/ws/answer/save',_data).success(function(resp){
            $scope.answeredQuestion=resp;
            $scope.txtanswer = ($scope.broadcastedQuestion.question.type=="free") ?$scope.answeredQuestion.answer:"";
            
            //notify server that client answered the question
            fcc_socket.emit("respondanswer",{});
            toastr.success("Successfully sent your answer!");
            $scope.setDisplayTemplate("answeredquestion_template")
    }).error(function(resp){
            toastr.error("Failed to submit answer!");
    });
}


$scope.sendMessage = function(){
    $scope.questions.emit('message',$scope.txtmessage);
}




$scope.init = function(){ 
    $scope.isInit=true;;         
    $scope.getBroadcastQuestion();    
}


fcc_socket.on('questionready', function (data) {
    $scope.getBroadcastQuestion();
});

$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
    //fcc_socket.disconnect();
    $scope.isInit=false;
    
});
    
})