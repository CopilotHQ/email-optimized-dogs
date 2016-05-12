'use strict';

/**
 * @ngdoc function
 * @name emailDogsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the emailDogsApp
 */
angular.module('emailDogsApp')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.templates = ['dog_001','dog_002','dog_003','doge','moonmoon','dogbountyhunter','loveletter'];
  }]);
