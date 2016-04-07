angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {})

.controller('EmployeeCtrl', function($scope, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

//  $scope.chats = Chats.all();
//  $scope.remove = function(chat) {
//    Chats.remove(chat);
//  };
    //panggil restfull service employee
    
    $http({
        method: 'GET',
        url: 'http://bkn-app.jelastic.skali.net/api/v1/employee'        
    }).success(function (obj, status) {
        $scope.employee = obj.payload.rows;        
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
