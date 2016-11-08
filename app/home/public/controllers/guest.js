'use strict';
FCC.controller("guestHomeController", function( $scope, $http,$rootScope,DialogService,$timeout,utilities,fcc_socket) {
$scope.chartData=[] 
$scope.chart = {}; 
$scope.broadcastedQuestion = null;

$scope.getPercent = function(a,b){
    return utilities.getPercent(a,b);
};
$scope.resetChart = function(){
    $scope.chart.data = [];
    $scope.chartData = [];
    $scope.chart.labels= [];
    $scope.chart.total=0;    
}
$scope.resetChartData = function(){
    $scope.chart.data = [];
    $scope.chartData = []; 
    $scope.chart.total = 0;
}

$scope.setupchart = function(data){
    if(!data) return;
    $scope.chart.labels=[];
    $scope.chart.data=[];
    $scope.chartData = [];
    if(data.type=="single" || data.type=="multi"){
        data.items.forEach(function(d){$scope.chart.labels.push(d.value + ". " + d.text);});
    }    
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

$scope.getcurrentallanswer = function(cb){        
        $http.get('/ws/answer/getallcurrent').success(function(resp){
            cb(resp);
        }).error(function(err){
            cb(err);
        });
};

$scope.buildchart = function(data){
    if(!data){
        $scope.resetChart();
        return;
    };


    if($scope.broadcastedQuestion.question.type!="free" && $scope.broadcastedQuestion && $scope.chart.labels.length==0){
        $scope.setupchart($scope.broadcastedQuestion.question); 
    };

    if($scope.broadcastedQuestion.question.type=="single"){                     
        $scope.resetChartData();
        console.log(data);
        var _tot = 0;            
        $scope.broadcastedQuestion.question.items.forEach(function(que){                    
            var sum = data.filter(function(d){return d.answer.value==que.value}).length;
            _tot+=sum;                                         
            $scope.chart.data.push(sum);
            $scope.chartData.push({value: que.value,text:que.text,count:sum});
        });     
        $scope.chart.total= _tot;
    }

    if($scope.broadcastedQuestion.question.type=="multi"){
         $scope.resetChartData(); 
        var _answer = [].concat.apply([], data.map(function(d){return d.answer}));
        var _tot = 0; 
         $scope.broadcastedQuestion.question.items.forEach(function(que){
             var sum = _answer.filter(function(d){return d.value==que.value}).length;
             _tot+=sum;
            $scope.chart.data.push(sum);
            $scope.chartData.push({value: que.value,text:que.text,count:sum});
            $scope.chart.total= _tot;
         }); 
    }
};
$scope.getrespond = function(){
    $scope.getcurrentallanswer(function(data){
        $scope.respondedtoquestion = data || null;
        $scope.buildchart(data);
        //$scope.$apply();
    });

}

$scope.init =  function(){
    $http.get('/ws/published/getpublished').success(function(resp){
        $scope.published = resp;
        $scope.broadcastedQuestion = resp || {};
        console.log(resp.question);
        $scope.setupchart(resp.question);   
        $scope.getrespond();       
        $scope.getbyuseranswer(resp,function(obj){            
                $scope.answeredQuestion = obj;                
                $scope.txtanswer = ($scope.broadcastedQuestion.question.type=="free") ?$scope.answeredQuestion.answer:"";
                       
        });      
    });

    //socket
    fcc_socket.on("broadcastinfo",function(){
        $scope.init();
    });

   
}
    
})