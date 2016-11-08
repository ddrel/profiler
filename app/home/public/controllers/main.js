'user strict';

FCC.controller("mainHomeController", function( $scope, $http,$rootScope,DialogService,$timeout,utilities,fcc_socket) {
$scope.eventsCollection = []; 
$scope.selectedEvent={};
$scope.published ={};
$scope.currentQuestion = {}; 
$scope.participantCount = 0; 
$scope.respondedtoquestion = []; 
$scope.chartData=[] 
$scope.chart = {}; 

$scope.resetAll = function(){
    $scope.eventsCollection = []; 
    $scope.selectedEvent={};
    $scope.published ={};
    $scope.currentQuestion = {}; 
    $scope.participantCount = 0; 
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
$scope.getcurrentallanswer = function(cb){        
        $http.get('/ws/answer/getallcurrent').success(function(resp){
            cb(resp);
        }).error(function(err){
            cb(err);
        });
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

$scope.refreshConnection = function(){
    $scope.resetAll();
    $scope.init();
};

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

// get the answer and build the chart
$scope.getrespond = function(){
    $scope.getcurrentallanswer(function(data){
        $scope.respondedtoquestion = data || null;
        $scope.buildchart(data);
        //$scope.$apply();        
    });

}

$scope.init = function(){
    $scope.__accesstodashboard__ = __user__.isAdmin;
    $http.get('/ws/events/getall').success(function(resp){
        $scope.eventsCollection = resp;
        $http.get('/ws/published/getpublished').success(function(resp){
            $scope.published = resp;
            $scope.currentQuestion = resp.question || {};
            $scope.setupchart(resp.question);     
            // included the getrespond                    
            fcc_socket.emit("getclientconnected",{}); 
            $scope.getrespond();  
           
            $timeout(function(){
                var ii = $scope.eventsCollection.map(function(d){return d._id}).indexOf($scope.published.event_ref)
                if(ii >-1){
                    $scope.selectedEvent = $scope.eventsCollection[ii];
                }
            });
        });
    });  
}//end init
//socket event
fcc_socket.on("participantCount",function(count){
    $scope.participantCount = count;   
    $scope.$apply();
});


fcc_socket.on("clientrespondtoquestion",function(data){
    $scope.getrespond();
});

fcc_socket.on("participantclientconnected",function(count){
    $scope.participantCount = count;
    //$scope.$apply();
});




$scope.broadcastSelected = function(item){
    $http.post('/ws/published/setquestionpublished',item).success(function(resp){
                $scope.currentQuestion = resp.question;
                toastr.success("Successfully broadcast question...");
                $scope.resetChart();
                $scope.getrespond();
               fcc_socket.emit("broadcastquestion",{});                              
            }).error(function(err){
                toastr.error("Broadcast question error...");
                console.log(err);
            });    
}

$scope.setpublished = function(){
    if($scope.published.event_ref!=$scope.selectedEvent._id){
        var confirmDialog = DialogService.confirm('Are you sure you want to published  ' +$scope.selectedEvent.title+ '?');
        confirmDialog.result.then(function (something) {
        var _data = {}
            _data.eventTitle = $scope.selectedEvent.title;
            _data.event_ref  = $scope.selectedEvent._id;
            _data.question  =  {};

            $http.post('/ws/published/setpublished',_data).success(function(resp){
                $scope.published = resp;
                $scope.currentQuestion={};
                $scope.resetChartData();
                //$scope.setupchart(resp.question);     
                $scope.getrespond();          
                toastr.success("Event succesfully published...");
            }).error(function(err){
                toastr.error("Publishing event error...");
                console.log(err);
            });
        });
    }           
}

$scope.sortableOptions = {
        connectWith: ".connectPanels",
        handler: ".ibox-title"
};




});

    