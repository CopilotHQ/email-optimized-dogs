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
  .controller('AppCtrl', ["$scope", "$location", "$http", function($scope, $location, $http){
    $scope.templates = ['dog_001','dog_002','dog_003','doge','moonmoon','dogbountyhunter','loveletter'];
    $scope.myTemplate = "";
    $scope.isMouseDown = false;
    $scope.mouseUp = function() {
      $scope.isMouseDown = false;
    };
    $scope.mouseDown = function() {
      $scope.isMouseDown = true;
    };


    // Open confirmation modal
    function confirmationModal (headline, message, button, callback){
      $('#confirmationModal #confirmationModal-header').html(headline);
      $('#confirmationModal #confirmationModal-body').html(message);
      $('#confirmationModal #confirmationModal-button').html(button);
      $('#confirmationModal #confirmationModal-button').on("click", function() {
        $('#confirmationModal').modal('hide');
        $('#confirmationModal #confirmationModal-button').off("click");
        callback();
        $scope.$apply();
      });
      $('#confirmationModal').modal('show');
    };

    $scope.isEdit = false;
    $scope.$on("$locationChangeSuccess", function () {
      $scope.isEdit = $location.path() == '/edit';
      if($scope.isEdit) {
        loadFromLibrary($location.search()["templateID"]);
      }
    });


    // Save the current state of the pallete to local storage
    $scope.savePixels = function(){
      var pixels = $('#palette').html().trim();
      localStorage.setItem('pixels', pixels);
    };


    // Load the current state of the pallete from local storage
    $scope.loadPixels = function() {
      confirmationModal("Are you sure you want to load from your local storage?", "Keep in mind, there's no way to get your beautiful artwork back, so make sure to save it out first.", "load", loadFromLocalStorage);
    };


    // Reset drawing canvas to blank
    // @TODO add confirmation before clearing
    $scope.clearPixels = function(){
      confirmationModal("Are you sure you want to clear the canvas?", "Keep in mind, there's no way to get your beautiful artwork back, so make sure to save it out first.", "clear canvas", loadFromLibrary);
    };


    // "private" functions are not actually private but please think if that like they are.
    function loadFromLibrary(template) {
      // Limit us to approved templates
      if(-1 === $scope.templates.indexOf(template)) {
        template = 'grid';
      }
      // Clear current template or else it may not reload the page.
      $scope.myTemplate = "";

      $http({
        method: 'GET',
        url: 'templates/'+template+'.html'
      }).then(function success(response) {
        $scope.myTemplate = response.data;
        console.log("Load from Library Complete");
      }, function error(response) {
        console.log(response);
      });
    }

    function loadFromLocalStorage(item) {
      $scope.myTemplate = localStorage.getItem('pixels');
      console.log("Load from Local Storage Complete");
    }

  }]);