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
      return utilities;
}]);
    