'use strict';
FCC.factory('utilities', ['$window','$rootScope',function ($window, $rootScope) {
    var utilities = {};
    utilities.formatDate= function(d){
        var date = new Date(d);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
      };

      utilities.formatBoolToString = function(b){
          return b?'Yes':'No';
      }

      utilities.uuid = function(){
           var G = function () {
              return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
          }
          return (G() + G()  + G()  + G()  + G()  + G() + G() + G()).toLocaleLowerCase();
      }

      utilities.getPercent = function(a,total){
          if(total ==0 && a ==0) return "0%";                    
          return  ((a / total) * 100).toFixed(2)  + "%"
      }


      utilities.ObjSize = function(obj){
        var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;          
      }

    utilities.formatToDecimal =  function(s){
 		if(!s) return 0;
 		return s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 	}

    utilities.cache = {};

    var _local_key = 'profiler-cache-storage';
    utilities.cache.setDataAnswer =  function(key,data){        
        if(!$window.localStorage.getItem(_local_key)){
            $window.localStorage.setItem(_local_key, '[]');        
        };

        var _objData = JSON.parse($window.localStorage.getItem(_local_key));
        var _keyIndex = _objData.map(function(d){return d.key}).indexOf(key);
        

        var _temp = [];
        for(var a in data){
            var _ans = data[a];                        
            _temp.push({qkey:a,answer:{default:_ans.default,text:_ans.text,value:_ans.value}});
        };
        if( _keyIndex>-1 && (_objData[_keyIndex].hostname==window.location.hostname)){
             _objData[_keyIndex].data = _temp;               
        }else{
            _objData.push({key:key,data:_temp,hostname:window.location.hostname});
        }


        $window.localStorage.setItem(_local_key,JSON.stringify(_objData))
        //console.log(JSON.parse($window.localStorage.getItem(_local_key)));        
        return this;
    }

    utilities.cache.getDataAnswer =  function(key){
        if(!$window.localStorage.getItem(_local_key)){
            $window.localStorage.setItem(_local_key, '[]');        
        };
        var _objData = JSON.parse($window.localStorage.getItem(_local_key));
        var _keyIndex = _objData.map(function(d){return d.key}).indexOf(key);

        var _a = [];
        if(_keyIndex>-1 && (_objData[_keyIndex].hostname==window.location.hostname)){
            var _data = _objData[_keyIndex];
            for(var i=0;i<_data.data.length;i++){
                var _ans = _data.data[i];
                _a[_ans.qkey] = {default:_ans.answer.default,text:_ans.answer.text,value:_ans.answer.value};
            }
        }

        return _a   

    }

    utilities.cache.removeDataAnswer =  function(key){
        if(!$window.localStorage.getItem(_local_key)){
            $window.localStorage.setItem(_local_key, '[]');        
        };

        var _objData = JSON.parse($window.localStorage.getItem(_local_key));
        var _keyIndex = _objData.map(function(d){return d.key}).indexOf(key);
        if( _keyIndex>-1 && (_objData[_keyIndex].hostname==window.location.hostname)){
             _objData.splice(_keyIndex,1);
             $window.localStorage.setItem(_local_key,JSON.stringify(_objData))          
        }

        return this;
    }


    utilities.export = {};
    utilities.export.csv =  function(filename,csv){
        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
        var link = document.createElement("a");    
        link.href = uri;

        console.log(filename);

        link.style = "visibility:hidden";
        link.download = filename + ".csv";
        
        document.body.appendChild(link);
            link.click();
        document.body.removeChild(link);
    }

    utilities.data = {}
    utilities.data.jrssCollection = [
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
                                    "System Engineering Professional-Web Services/SOA"
                                ]

      return utilities;
}]);
    