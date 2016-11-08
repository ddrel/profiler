(function(){
  FCC.controller("publicController", function( $scope, $http,$rootScope,utilities,public_socket) {
$scope.selectedEvent={};
$scope.published ={};
$scope.currentQuestion = {}; 
$scope.respondedtoquestion = []; 
$scope.chartData=[] 
$scope.chart = {}; 

$scope.buildchart = function(data){
    if(!data){
        $scope.resetChart();
        return;
    };

    if($scope.currentQuestion.type!="free" && $scope.currentQuestion && $scope.chart.labels.length==0){
        $scope.setupchart($scope.currentQuestion); 
    };

    if($scope.currentQuestion.type=="single"){                     
        $scope.resetChartData();
        console.log(data);
        var _tot = 0;            
        $scope.currentQuestion.items.forEach(function(que){                    
            var sum = data.filter(function(d){return d.answer.value==que.value}).length;
            _tot+=sum;                                         
            $scope.chart.data.push(sum);
            $scope.chartData.push({value: que.value,text:que.text,count:sum});
        });     
        $scope.chart.total= _tot;
    }

    if($scope.currentQuestion.type=="multi"){
         $scope.resetChartData(); 
        var _answer = [].concat.apply([], data.map(function(d){return d.answer}));
        var _tot = 0; 
         $scope.currentQuestion.items.forEach(function(que){
             var sum = _answer.filter(function(d){return d.value==que.value}).length;
             _tot+=sum;
            $scope.chart.data.push(sum);
            $scope.chartData.push({value: que.value,text:que.text,count:sum});
            $scope.chart.total= _tot;
         }); 
    }

};

$scope.getcurrentallanswer = function(cb){        
        $http.get('/ws/answer/getallcurrent').success(function(resp){
            cb(resp);
        }).error(function(err){
            cb(err);
        });
};
// get the answer and build the chart
$scope.getrespond = function(){
    $scope.getcurrentallanswer(function(data){
        $scope.respondedtoquestion = data || null;
        $scope.buildchart(data);
    });

}

$scope.resetAll = function(){
    $scope.selectedEvent={};
    $scope.published ={};
    $scope.currentQuestion = {};  
    $scope.respondedtoquestion = []; 
    $scope.chartData=[] 
    $scope.chart = {}; 
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


$scope.init =  function(){
    $http.get('/ws/published/getpublished').success(function(resp){
        $scope.published = resp;
        $scope.currentQuestion = resp.question || {};
        console.log(resp.question);
        $scope.setupchart(resp.question);      
        $scope.getrespond();  
    });
}

//socket
public_socket.on("broadcastinfo",function(){
    $scope.resetAll();
    $scope.resetChart();
    $scope.resetChartData();
    $scope.init();
});



});
})();
