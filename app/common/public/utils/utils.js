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
        if( _keyIndex>-1){
             _objData[_keyIndex].data = _temp;  
        }else{
            _objData.push({key:key,data:_temp});
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
        if(_keyIndex>-1){
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
        if( _keyIndex>-1){
             _objData.splice(_keyIndex,1);
             $window.localStorage.setItem(_local_key,JSON.stringify(_objData))          
        }

        return this;
    }


      return utilities;
}]);
    