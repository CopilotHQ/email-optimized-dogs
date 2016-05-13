'use strict';

/**
 * @ngdoc overview
 * @name emailDogsApp
 * @description
 * # emailDogsApp
 *
 * Main module of the application.
 */
angular
  .module('emailDogsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/edit', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

// Setting some global stuff.
angular.module('emailDogsApp')
  .controller('AppCtrl', ["$scope", "$location", function($scope, $location){
    $scope.isMouseDown = false;
    $scope.mouseUp = function() {
      $scope.isMouseDown = false;
    };
    $scope.mouseDown = function() {
      $scope.isMouseDown = true;
    };


    // Open confirmation modal
    $scope.confirmationModal = function(headline, message, button, func){
      $('#confirmationModal #confirmationModal-header').html(headline);
      $('#confirmationModal #confirmationModal-body').html(message);
      $('#confirmationModal #confirmationModal-button').html(button);
      $('#confirmationModal #confirmationModal-button').on("click", function() {
        $('#confirmationModal').modal('hide');
        $('#confirmationModal #confirmationModal-button').off("click");
        func();
        $scope.$apply();
      });
      $('#confirmationModal').modal('show');
    };

    $scope.isEdit = false;
    $scope.$on("$locationChangeSuccess", function () {
      $scope.isEdit = $location.path() == '/edit';
    });


  }]);