'use strict';
  FCC.controller('ConfirmDialogController', ['$scope', '$modalInstance', 'msg',
    function ($scope, $modalInstance, msg) {
      $scope.msg = msg;

      // function if YES
      $scope.yes = function () {
        // can pass a parameter if you want the parent controller get
        // the details from the dialog
        $modalInstance.close();
      };

      // function if NO
      $scope.no = function () {
        // close window without getting any details
        // close / exit / ignore
        $modalInstance.dismiss('Dismiss confirm dialog instance.');
    };
  }]);
