var FCC = angular.module('FCC', ['ngSanitize','ui.bootstrap','chart.js'])
.controller("lnkController", function( $scope, $http,$rootScope,utilities,DialogService,$window,$timeout) {

    $scope.eventsCollection = [];
    $scope.questionnaire = [];
    $scope.paginationQuest = {};
    $scope.paginationQuest.maxSize= 10; 
    $scope.paginationQuest.CurrentPage=1;
    $scope.practitioners = [];
    $scope.jrssCollection = [];
    $scope.selectedjrss=null;
    $scope.chart = {};
    $scope.chart.data = [];
    $scope.chart.labels = [];
    $scope.loadingSignal=false;


    $scope.export = function(){
         window.location.href = "/ws/profiler/exportPerJrss?jrss=" + encodeURIComponent($scope.selectedEvent.title);
    }

    $scope.exportbyAnswer = function(a,b,c){
        var _csv = a.title + "\r\n";
            _csv+= b.value  + ". " + b.text +"\r\n";
            _csv+= "\r\n";
            _csv+= "Name,Email" + "\r\n";
            c.forEach(function(p){
                _csv+= p.user_id.intranet_name.replace(/,/g,"").replace(".","") +  "," + p.user_id.email + "\r\n";
            })
            utilities.export.csv(a.title,_csv);
    }


    $scope.init =  function(){       
        $timeout(function(){
            $http.get('/ws/events/getall').success(function(event){
                  $http.get('/ws/profiler/practitioners_count').success(function(practCount){                                                                                         
                            [
                                "Application Developer-Java.Core",
                                "Application Developer-Java.WebSphere",
                                "Application Developer-Java.Spring",
                                "Application Developer-Java.Weblogic",
                                "Application Developer-Java.EJB",
                                "Application Developer-Cloud.Java",
                                "Application Architect-Java",
                                "Technical Team Leader-Java",
                                "Test Specialist-Custom Applications",
                                "Application Developer-SAP.ABAP",
                                "Application Developer-SAP.ABAP.HR",
                                "Application Developer-SAP.ABAP.CRM",
                                "Application Developer-SAP.ABAP.Workflow",
                                "Technical Team Leader-SAP.ABAP",
                                "Application Developer-C#.NET", 
                                "Data Management Support Specialist-ETL.DataStage",
                                "Application Developer-COBOL", 
                                "Application Developer-Oracle Database",
                                "Application Developer-Oracle Applications", 
                                "Application Developer-AIX/UNIX",
                                "Architect-SAP.BA.Basis",
                                "Architect-SAP.Basis",
                                "Application Architect-SAP.Basis",
                                "Application Developer-Web Technologies",
                                "Application Developer-VB.NET", 
                                "Application Database Administrator-Oracle Database",
                                "Application Database Administrator-Oracle Applications",
                                "Application Developer-COGNOS.BI",
                                "Packaged Application Enablement Specialist-Oracle.Customer Care & Billing",
                                "Package Solution Consultant-Oracle.Customer Care & Billing",
                                "Test Specialist-Automation Tools",
                                ].forEach(function(s){
                                    var idx = practCount.done_true.map(function(d){return d._id}).indexOf(s);
                                    if(idx>-1){
                                        $scope.jrssCollection.push({jrss:s,text:s + " (" + practCount.done_true[idx].total  + ")"})
                                    }else{
                                        $scope.jrssCollection.push({jrss:s,text:s + " (0)"})
                                    }

                                })
	    	         });  
                $scope.eventsCollection = event;
                $("#main_row").css("visibility","visible");
            });
        });//timeout   
   
    };

    $scope.getpractitionerbyquestion =  function(event_id,question_id,callback){
         $http.get('/ws/profiler/getanswerbyjrss?event_id=' + event_id + "&question_id=" + question_id).success(function(resp){                                   
            
            return callback(resp)
        });        
    }


     $scope.pageChanged = function(page){
         $scope.currentQuest = $scope.questionnaire[page -1];
         $scope.loadingSignal=true;
         $timeout(function(){
              $scope.getpractitionerbyquestion($scope.selectedEvent._id,$scope.currentQuest._id,function(data){
                $scope.practitioners = data;
                $scope.buildChart(); 
                $scope.loadingSignal=false;
             });

         });
         //console.log(page);
     }; 

     $scope.getpractitionerbyanswer =  function(a){
         return $scope.practitioners.filter(function(d){
             return d.answer.value == a;
         }).sort(function(a,b){
             var nameA = a.user_id.intranet_name;
             var nameB = b.user_id.intranet_name;
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
         });
     }


     $scope.buildChart = function(){
        $scope.chart.data = [];
        $scope.chart.labels = [];
           var _a = [];
            $scope.currentQuest.items.forEach(function(a) {
                $scope.chart.labels.push(a.value);
                var _count = $scope.getpractitionerbyanswer(a.value).length;                       
                    _a.push(_count);                                                   
            });
            $scope.chart.data.push(_a);
     }

    $scope.selectedEvent = null;
    $scope.onEventsChange =  function(jrss){
        //console.log($scope.selectedEvent);
        $scope.loadingSignal=true;
        $timeout(function(){
            var idx = $scope.eventsCollection.map(function(d){return d.title}).indexOf($scope.selectedjrss.jrss) ;
            if(idx>-1){
                $scope.selectedEvent = $scope.eventsCollection[idx];
                $scope.questionnaire = $scope.selectedEvent.questionnaire;
                $scope.currentQuest = $scope.questionnaire[0];
                
                $scope.getpractitionerbyquestion($scope.selectedEvent._id,$scope.currentQuest._id,function(data){
                    $scope.practitioners = data;
                    $scope.buildChart();                   
                    $scope.loadingSignal=false;
                });

            }
        })
        
    }

});
