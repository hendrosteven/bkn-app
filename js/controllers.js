angular.module('starter.controllers', [])

.controller('LoginCtrl',function($scope, $ionicModal, $http, md5, $cordovaToast, $state, $base64, $ionicHistory){

    //cek if already login
    if (window.localStorage['auth']) {
        $state.go('tab.dash');
    }

    $scope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });

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
                $scope.input = {};
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
                $scope.loged = obj.payload.rows;
                window.localStorage['auth'] = string;
                window.localStorage['id'] = $scope.loged.id;
                window.localStorage['fullName'] = $scope.loged.fullName;
                window.localStorage['email'] = $scope.loged.email;
                $scope.login = {};
                $state.go('tab.dash');
            } else {
                $cordovaToast.showLongCenter("Login Gagal");
            }
        });
    };

})

.controller('DashCtrl', function($scope, $http) {})

.controller('EmployeeCtrl', function($scope, $http, $ionicModal, $cordovaToast, $ionicHistory, $ionicScrollDelegate) {
    $scope.auth = window.localStorage['auth'];
    $scope.page = 1; //default page = 1

    $scope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });

    //panggil restfull service employee
    $http({
        method: 'GET',
        url: 'http://bkn-app.jelastic.skali.net/api/v1/employee/page/'+$scope.page,
        headers: {'Authorization': 'Basic ' + $scope.auth}
    }).success(function (obj, status) {
        $scope.employee = obj.payload.rows;        
    });
    
    $scope.refresh = function(){
        $scope.page = 1;
        $http({
            method: 'GET',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/employee/page/'+$scope.page,
            headers: {'Authorization': 'Basic ' + $scope.auth}
        }).success(function (obj, status) {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $scope.isScroll = true;
            $scope.employee = obj.payload.rows;
            $ionicScrollDelegate.scrollTop();
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
            //$scope.refresh;
            $scope.input = {};
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


    //handle pagging
    $scope.isScroll = true;
    $scope.scroolTrue = function () {
        return $scope.isScroll;
    };

    //load more
    $scope.loadMore = function () {
        $scope.page += 1;
        $http({
            method: 'GET',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/employee/page/' + $scope.page,
            headers: {'Authorization': 'Basic ' + $scope.auth}
        }).success(function (obj, status) {
            var listEmp = obj.payload.rows;
            if (listEmp.length > 0) {
                $scope.employee = $scope.employee.concat(listEmp);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $cordovaToast.showShortCenter('Last records');
                $scope.isScroll = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        });
    };

})

.controller('EmployeeDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})



.controller('AccountCtrl', function($http, $cordovaToast, $scope, $ionicHistory, $state, $ionicModal, md5, $base64) {

    $scope.account = {
       "id" : window.localStorage['id'],
       "fullName" : window.localStorage['fullName'],
       "email"    : window.localStorage['email'],
       "password" : ""
    };

    $scope.logout = function(){
        window.localStorage.removeItem('auth');
        window.localStorage.removeItem('id');
        window.localStorage.removeItem('fullName');
        window.localStorage.removeItem('email');
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $state.go('login');
    };

    //setup edit form dialog
    $ionicModal.fromTemplateUrl('templates/update.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.editOpen = function () {
        $scope.modal.show();
    };

    $scope.editClose = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });



    $scope.update = function(){

        var pass = md5.createHash($scope.account.password);
        $scope.account.password = pass;
        $scope.auth = window.localStorage['auth'];

        var string = $base64.encode($scope.account.email + ':' + pass);

        $http({
            method: 'POST',
            url: 'http://bkn-app.jelastic.skali.net/api/v1/users/update',
            data : $scope.account,
            headers: {'Authorization': 'Basic ' + $scope.auth}
        }).success(function (obj, status) {
            if(obj.responseStatus!=false){
                $scope.users = obj.payload.rows;
                window.localStorage['auth'] = string;
                window.localStorage['id'] = $scope.users.id;
                window.localStorage['fullName'] = $scope.users.fullName;
                window.localStorage['email'] = $scope.users.email;
                $cordovaToast.showLongCenter('Users updated');
                $scope.modal.hide();
            }else{
                $cordovaToast.showLongCenter(obj.responseMessage);
            }
        });
    };

});
