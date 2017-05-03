var FCC = angular.module('FCC', ['ngSanitize','ui.bootstrap'])
.controller("practionersController", function( $scope, $http,$rootScope,utilities,DialogService,$window,$timeout,practitionersDialogService,practitionersDataDialogService) {

$scope.practitioners = {};    
$scope.jrssCollection = [];
$scope.noresponseCollection = [];


$scope.displayPractitioner =  function(qry,jrss){
    var _fnc =  function(qry,jrss,cb){
        var _practitioners = []
        if(qry=="noresponse"){
                _practitioners = $scope.getNoResponse(jrss);
                cb(qry,jrss,_practitioners);
        }else{
               var _status = qry=="done_true"?true:false;
              $http.get('/ws/profiler/getPractionerByStatus?status=' + _status + "&jrss=" +jrss).success(function(resp){
                     var _r = resp.sort(function(a,b){
                                var nameA = a.intranet_name;
                                var nameB = b.intranet_name;
                                if (nameA < nameB) {
                                    return -1;
                                }
                                if (nameA > nameB) {
                                    return 1;
                                }
                            })                     
                     cb(qry,jrss,_r);
              })          
        }
    }

    _fnc(qry,jrss,function(a,b,c){
         practitionersDataDialogService.set({status:a,jrss:b,practitioners:c});      
            var practDialog= practitionersDialogService.loadDialog();
            practDialog.result.then(function(resp){            
        });        
    })

   
}

 




$scope.getPercent =  function(a,b){
    a = a=="--"?0:a;
    b = b=="--"?0:b;
    return utilities.getPercent(a,b);
};

$scope.getPractitionerCount =  function(j){
    var _idx =  $scope.jrssGroupCount.map(function(d){return d._id}).indexOf(j);
    return (_idx >-1)?$scope.jrssGroupCount[_idx].count:0;
}

$scope.getTotal =  function(j){
    var _m = 0;
    var _a = $scope.practitioners.done_true.map(function(d){return d._id}).indexOf(j);
    var _b = $scope.practitioners.done_false.map(function(d){return d._id}).indexOf(j);    
    _m =_a>-1?$scope.practitioners.done_true[_a].total:0;
    _m +=_b>-1?$scope.practitioners.done_false[_b].total:0; 

    return _m;
}
$scope.getDone =  function(j,b){
    var _key = b?"done_true":"done_false";
    var _index = $scope.practitioners[_key].map(function(d){return d._id}).indexOf(j);

    if(_index>-1){
        return $scope.practitioners[_key][_index].total || 0
    }
        return  "--"; 
} 


$scope.buildJrssList =  function(list,cb){
    
    list.done_true.forEach(function(element) {
        if($scope.jrssCollection.indexOf(element._id)==-1){
            $scope.jrssCollection.push(element._id);
        }

    });

    list.done_false.forEach(function(element) {
        if($scope.jrssCollection.indexOf(element._id)==-1){
            $scope.jrssCollection.push(element._id);
        }
        
    });

    cb($scope.jrssCollection);
    
}


$scope.getNoResponse =  function(j){
    return $scope.noresponseCollection.filter(function(d){return d.JRSS==j}).sort(function(a,b){
             var nameA = a.Name;
             var nameB = b.Name;
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
         });;
}
$scope.jrssGroupCount = [];  
$scope.init =  function(){  
    $timeout(function(){
        $http.get('/ws/profiler/practitioners_count').success(function(resp){      
            $http.get('/ws/profiler/jrssgroupcount').success(function(practCount){
                  $scope.practitioners = resp || {};             
                                    
                  $scope.jrssCollection = [
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
                    "Application Architect-SAP.Basis",
                    "Architect-SAP.Basis",
                    "Application Developer-Web Technologies",
                    "Application Developer-VB.NET", 
                    "Application Database Administrator-Oracle Database",
                    "Application Database Administrator-Oracle Applications",
                    "Application Developer-COGNOS.BI",
                    "Packaged Application Enablement Specialist-Oracle.Customer Care & Billing",
                    "Package Solution Consultant-Oracle.Customer Care & Billing",
                    "Test Specialist-Automation Tools",
                    "Application Architect-SAP",
                    "Application Architect-SAP.BA.Basis",
                    "Application Architect-SAP.Basis.Solution Manager",
                    "Application Architect-SAP.Security",
                    "Application Architect-Security",
                    "Architect-SAP",
                    "Architect-SAP.Basis.Solution Manager",
                    "Architect-SAP.Security",
                    "Application Developer-Web Services/SOA",
                    "Application Architect-Web Services/SOA",
                    "Application Consultant-Web Services/SOA",
                    "System Engineering Professional-Web Services/SOA"];


                     $http.get('/ws/profiler/getpractitionernoresponse').success(function(noresponse){
                        $scope.noresponseCollection = noresponse.data
                        $scope.jrssGroupCount = practCount;  
                        $scope.grandTotal();  
                     })
                        

                                  
            });
	 });
    }) ; 
    
};

$scope.grandTotal =  function(){
    var _total = 0;
    for(var i in $scope.jrssCollection){
        var _key = $scope.jrssCollection[i]

         var _a = $scope.practitioners.done_true.map(function(d){return d._id}).indexOf(_key);
         var _b = $scope.practitioners.done_false.map(function(d){return d._id}).indexOf(_key);

         if(_a >-1){_total +=$scope.practitioners.done_true[_a].total;}
	     if(_b >-1){_total +=$scope.practitioners.done_false[_b].total;}
         
    }
    return _total;
};

})
.controller("practitionersDialogController", function( $scope, $http,$rootScope,utilities,DialogService, $modalInstance,practitionersDialogService,practitionersDataDialogService,$window,$timeout) {
    $scope.practitioners = {};
    $scope.practitioners.status="";
    $scope.practitioners.list= [];
    $scope.init= function(){
        $timeout(function(){
            //$scope.practitioners.status =  practitionersDataDialogService.get().status; 
            $scope.practitioners.jrss =  practitionersDataDialogService.get().jrss;    
            $scope.practitioners.list =  practitionersDataDialogService.get().practitioners;  
        })
        
    }

    $scope.export =  function(){
        var csv = "Name,Email,\r\n" 
        $scope.practitioners.list.forEach(function(practitioner){
                csv+= (practitioner.intranet_name || practitioner.Name).replace(/,/g,"") + "," + (practitioner.email  || practitioner.intranet_id) + "\r\n";
        });

        utilities.export.csv(practitionersDataDialogService.get().status + "-" + $scope.practitioners.jrss.replace(/ /g,"").replace(".",""),csv);

    }
    $scope.cancel =  function() {
          $modalInstance.dismiss('Dismiss create group dialog instance.');
    };
});
