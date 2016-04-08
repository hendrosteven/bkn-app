angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {})

.controller('EmployeeCtrl', function($scope, $http, $ionicModal) {

    //panggil restfull service employee
    $http({
        method: 'GET',
        url: 'http://bkn-app.jelastic.skali.net/api/v1/employee'        
    }).success(function (obj, status) {
        $scope.employee = obj.payload.rows;        
    });
    
    $scope.refresh = function(){
        $http({
            method: 'GET',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/employee'        
        }).success(function (obj, status) {
            $scope.employee = obj.payload.rows;
        });
    };
    
    $scope.input = {};

    //setup edit form dialog
    $ionicModal.fromTemplateUrl('templates/employee-input.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

})

.controller('EmployeeDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
