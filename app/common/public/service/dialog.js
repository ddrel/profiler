  FCC.service('DialogService', ['$modal', function($modal) {
    var DialogProvider = {};
    /*
     * Will create a new instance of confirm dialog
     */
     DialogProvider.confirm = function( msg ){
      return $modal.open({
          animation: true,
          templateUrl: '/common/views/dialog/confirm.html',
          controller: 'ConfirmDialogController',
          backdrop: 'static',
          resolve: {
            msg: function () {
              return msg;
            }
          }
        });
    };

    return DialogProvider;
  }
])
.service('eventsDialogService', ['$modal', function($modal) {
    var eventsDialogService = {};
     eventsDialogService.loadeventDialog = function(){
      return $modal.open({
          animation: true,
          templateUrl: '/events/views/dialog/events.html',
          controller: 'eventsDialogController',
          backdrop: 'static'
        });
    };

    return eventsDialogService;
  }
])
.service('questDialogService', ['$modal', function($modal) {
    var questDialogService = {};
     questDialogService.loadDialog = function(){
      return $modal.open({
          animation: true,
          templateUrl: '/questionnaire/views/dialog/questionnaire.html',
          controller: 'questDialogController',
          backdrop: 'static'
        });
    };

    return questDialogService;
  }
])
.service('eventsDialogDataService', [ function() {
    var eventsDialogDataService = {};
    var _selected = null;
    eventsDialogDataService.set =  function(obj){
        _selected = obj;
    }

    eventsDialogDataService.get =  function(){
      return _selected;
    }

    return eventsDialogDataService;
  }])
  .service('questDialogDataService', [ function() {
    var questDialogDataService = {};
    var _selected = null;
    questDialogDataService.set =  function(obj){
        _selected = obj;
    }

    questDialogDataService.get =  function(){
      return _selected;
    }

    return questDialogDataService;
  }]);
