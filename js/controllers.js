angular.module('starter.controllers', [])

.controller('LoginCtrl',function($scope, $ionicModal, $http, md5, $cordovaToast, $state, $base64){

    $scope.input = {
        "email" : "",
        "password" : "",
        "fullName" : ""
    }

    $scope.login = {
        "email" : "",
        "password" : ""
    }

    //setup signup form dialog
    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.signupOpen = function () {
        $scope.modal.show();
    };

    $scope.signupClose = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

    $scope.register = function(){
        var pass = md5.createHash($scope.input.password);
        $scope.input.password = pass;

        $http({
            method: 'POST',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/users/register',
            data : $scope.input
        }).success(function (obj, status) {
            if(obj.responseStatus!=false){
                $scope.users = obj.payload.rows;
                $cordovaToast.showLongCenter('Registered User Id : ' + $scope.users.id);
                $scope.input.email = "";
                $scope.input.password = "";
                $scope.input.fullName = "";
                $scope.modal.hide();
            }else{
                $cordovaToast.showLongCenter(obj.responseMessage);
            }
        });
    };

    $scope.dologin = function(){
        var pass = md5.createHash($scope.login.password);
        $scope.login.password = pass;

        var string = $base64.encode($scope.login.email + ':' + pass);

        $http({
            method: 'POST',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/users/login',
            data: $scope.login
        }).success(function (obj, status) {
            if (obj.responseStatus === true) {
                window.localStorage['auth'] = string;
                $state.go('tab.dash');
            } else {
                $cordovaToast.showLongCenter("Login Gagal");
            }
        });
    };

})

.controller('DashCtrl', function($scope, $http) {})

.controller('EmployeeCtrl', function($scope, $http, $ionicModal, $cordovaToast) {
    $scope.auth = window.localStorage['auth'];
    //panggil restfull service employee
    $http({
        method: 'GET',
        url: 'http://bkn-app.jelastic.skali.net/api/v1/employee',
        headers: {'Authorization': 'Basic ' + $scope.auth}
    }).success(function (obj, status) {
        $scope.employee = obj.payload.rows;        
    });
    
    $scope.refresh = function(){
        $http({
            method: 'GET',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/employee',
            headers: {'Authorization': 'Basic ' + $scope.auth}
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
            data: $scope.input,
            headers: {'Authorization': 'Basic ' + $scope.auth}
        }).success(function (obj, status) {
            $scope.refresh;
            $scope.modal.hide();
        });
    };


    //handle searching
    $scope.searching = function(keyword){
        $http({
            method: 'GET',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/employee/name/'+keyword,
            headers: {'Authorization': 'Basic ' + $scope.auth}
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
