var FCC = angular.module('FCC', ['ngSanitize','ui.bootstrap','chart.js'])
.controller("profilerReportController", function( $scope, $http,$rootScope,utilities,DialogService,$window,$timeout) {

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
    $scope.currentSelectTextItem=null;
    $scope.currentQuest = [];
    $scope.currentpractitioner_answer =  null;

    $scope.selectjrss =  function(a){
        var elem = $("#practitioner_pane_" + a);
        var toggle = $("#practitioner_toggle_" + a);
        var b = elem.css("display")=="none";
        var toggle_event = b?"slideDown":"slideUp";
        if(b) toggle.addClass("fa-minus-square");
        if(!b) toggle.removeClass("fa-minus-square");       
        elem[toggle_event]("slow",function(){})
    }


    $scope.currentSelectionFilter="jrss";
    $scope.currentProfiler_jrss =  null;
    $scope.currentProfiler_practitioner = null;
    $scope.selectedDisplay= function(j,k){
    $scope.currentSelectionFilter=j;
            console.log(k.jrss)
        $scope.currentProfiler_jrss =  null;
        $scope.currentProfiler_practitioner = null;
        if(j=="jrss"){
            $scope.currentSelectTextItem = k.jrss;
            $scope.onEventsChange(k);
            $scope.currentProfiler_jrss = k;            
        }
        
        if(j=="practitioner"){
            $scope.currentSelectTextItem = k.intranet_name;
            $scope.currentProfiler_practitioner = k;   
            $scope.onPractitionerChange(k);

        }
        
    }

    $scope.filterPractitioner =  function(k){
        if(k==""){$scope.jrssCollectionResult = $scope.jrssCollection;}
        if(k.length<2) return false;
         var _a = $scope.jrssCollection.filter(function(d){return d.jrss.toLowerCase().indexOf(k)>-1}) || [];
         var _b = [];
         
            $scope.jrssCollection.forEach(function(obj){
                    var _practitioner = obj.practitioners;
                     var _filter = _practitioner.filter(function(d){return d.intranet_name.toLowerCase().indexOf(k)>-1})
                     if(_filter.length>0){
                         _b.push.apply( _b, _filter ); 
                     }                                
            })


            if(_a.length>0 && _b.length>0){
                _a.forEach(function(j){
                        var _p = _b.filter(function(d){return d.jrss==j.jrss});
                        if(_p.length==0){_a.push({jrss:j.jrss,count:_p.length ,practitioners:_p, text:j.jrss + " (" + _p.length  + ")"})}
                })
            }else if(_a.length==0 && _b.length>0){
                utilities.data.jrssCollection.forEach(function(jrss){
                        var _p = _b.filter(function(d){return d.jrss==jrss});
                        if(_p.length>0){_a.push({filtered:true,jrss:jrss,count:_p.length ,practitioners:_p, text:jrss + " (" + _p.length  + ")"})}
                })
            }else if(k==""){
                _a =  $scope.jrssCollection;
            }
            
            $scope.jrssCollectionResult =_a;
            return _a;
    }


    $scope.init =  function(){       
        $timeout(function(){
            $http.get('/ws/events/getall').success(function(event){
                  $http.get('/ws/profiler/practitioners_count').success(function(practCount){
                      $http.get('/ws/profiler/getPractionerByStatusDone').success(function(practitioners){
                             utilities.data.jrssCollection.forEach(function(s){
                                    var idx = practCount.done_true.map(function(d){return d._id}).indexOf(s);
                                    if(idx>-1){
                                        var _practitioners = practitioners.filter(function(d){return d.jrss==s}).sort(function(a,b){
                                                            var nameA = a.intranet_name;
                                                            var nameB = b.intranet_name;
                                                            if (nameA < nameB) {
                                                                return -1;
                                                            }
                                                            if (nameA > nameB) {
                                                                return 1;
                                                            }
                                                        });;
                                        $scope.jrssCollection.push({jrss:s,count:practCount.done_true[idx].total ,practitioners:_practitioners, text:s + " (" + practCount.done_true[idx].total  + ")"})
                                    }else{
                                        $scope.jrssCollection.push({jrss:s,count:0,practitioners:[],text:s + " (0)"})
                                    }

                                })

                                $scope.jrssCollection.sort(function(a,b){return b.count-a.count});
                                $scope.jrssCollectionResult = $scope.jrssCollection;
                                 //console.log($scope.jrssCollection);  
                         })                                                                                                                    
	    	         });  

                  
                $scope.eventsCollection = event;
                $("#main_row").css("visibility","visible");              
            });
        });//timeout   
   
    };

    $scope.getpractitionerbyquestion =  function(event_id,question_id,users,callback){
         var url = '/ws/profiler/getanswerbyjrss?event_id=' + event_id + "&question_id=" + question_id;

         if(users !=null){
             url+="&users=" + users;
         }
         
         $http.get(url).success(function(resp){                                   
            
            return callback(resp)
        });        
    }


     $scope.pageChanged = function(page){
         $scope.currentQuest = $scope.questionnaire[page -1];
         $scope.loadingSignal=true;
         $timeout(function(){
                console.log( $scope.selectedEvent );
                var _practitioners =  null;
                if($scope.currentProfiler_practitioner){
                    _practitioners = $scope.currentProfiler_practitioner.email + ",";
                }else if($scope.currentProfiler_jrss && $scope.currentProfiler_jrss.filtered){
                        _practitioners = "";
                        $scope.currentProfiler_jrss.practitioners.forEach(function(u){
                        _practitioners+= u.email + ",";
                    });
                }


              $scope.getpractitionerbyquestion($scope.selectedEvent._id,$scope.currentQuest._id,_practitioners,function(data){
                $scope.practitioners = data;                 
                $scope.loadingSignal=false;
                if($scope.currentProfiler_practitioner){
                    var idx = $scope.currentQuest.items.map(function(d){return d.value}).indexOf(data[0].answer.value)
                    $scope.currentpractitioner_answer   = $scope.currentQuest.items[idx].value + ". " + $scope.currentQuest.items[idx].text;
                }else{
                    $scope.buildChart();
                }

                

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
    $scope.onEventsChange =  function(j){
        //console.log($scope.selectedEvent);
        $scope.loadingSignal=true;
        $timeout(function(){
            var idx = $scope.eventsCollection.map(function(d){return d.title}).indexOf(j.jrss) ;
            if(idx>-1){
                $scope.selectedEvent = $scope.eventsCollection[idx];
                $scope.questionnaire = $scope.selectedEvent.questionnaire;
                $scope.currentQuest = $scope.questionnaire[0];
                
                var _practitioners = null;                
                if(j.filtered){
                    _practitioners = "";
                    j.practitioners.forEach(function(u){
                            _practitioners+= u.email + ",";
                    });
                }

                $scope.getpractitionerbyquestion($scope.selectedEvent._id,$scope.currentQuest._id,_practitioners,function(data){
                    $scope.practitioners = data;
                    $scope.buildChart();                   
                    $scope.loadingSignal=false;                    
                });

            }
        })        
    }


    $scope.onPractitionerChange =  function(j){
        $timeout(function(){
            var idx = $scope.eventsCollection.map(function(d){return d.title}).indexOf(j.jrss) ;
            if(idx>-1){
                $scope.selectedEvent = $scope.eventsCollection[idx];
                $scope.questionnaire = $scope.selectedEvent.questionnaire;
                $scope.currentQuest = $scope.questionnaire[0];
                var _practitioners = j.email + ",";                              
                $scope.getpractitionerbyquestion($scope.selectedEvent._id,$scope.currentQuest._id,_practitioners,function(data){
                    $scope.practitioners = data;                  
                    $scope.loadingSignal=false;                    
                    var idx = $scope.currentQuest.items.map(function(d){return d.value}).indexOf(data[0].answer.value)
                    $scope.currentpractitioner_answer   = $scope.currentQuest.items[idx].value + ". " + $scope.currentQuest.items[idx].text;
                });

            }
        })  

    }


    

    $scope.export =  function(){
        if($scope.currentProfiler_practitioner){
            var _practitioners = $scope.currentProfiler_practitioner._id + ",";
            window.location.href = "/ws/profiler/exportPerJrss?jrss=" + encodeURIComponent($scope.selectedEvent.title) + "&users=" + _practitioners;
        }else if($scope.currentProfiler_jrss && $scope.currentProfiler_jrss.filtered){
                _practitioners = "";
                $scope.currentProfiler_jrss.practitioners.forEach(function(u){
                _practitioners+= u._id + ",";
                });                   
            window.location.href = "/ws/profiler/exportPerJrss?jrss=" + encodeURIComponent($scope.selectedEvent.title) + "&users=" + _practitioners;
        }else{
            window.location.href = "/ws/profiler/exportPerJrss?jrss=" + encodeURIComponent($scope.selectedEvent.title);
        } 

        //utilities.export.csv(filename,csv);
    }

});
