angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {})

.controller('EmployeeCtrl', function($scope, $http, $ionicModal, $cordovaToast) {

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
    
    $scope.input = {
        "number" : "",
        "fullName" : "",
        "address" : "",
        "email" : "",
        "phone" : "",
        "photo" : "-",
        "inputBy" : null
    };

    //handle save button
    $scope.save = function(){
        $http({
            method: 'POST',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/employee',
            data: $scope.input
            //headers : {'Content-Type' : 'application/json'}
        }).success(function (obj, status) {
            $scope.refresh;
            $scope.modal.hide();
        });
    };


    //handle searching
    $scope.searching = function(keyword){
        $http({
            method: 'GET',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/employee/name/'+keyword
        }).success(function (obj, status) {
            if (obj.payload.rows.length > 0) {
                 $scope.employee = obj.payload.rows;
            } else {
                $cordovaToast.showLongCenter('Data tidak ditemukan');
            }
        });
    };


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
