'use strict';

/**
 * @ngdoc function
 * @name emailDogsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the emailDogsApp
 */
angular.module('emailDogsApp')
  .controller('EditCtrl', ["$scope", "$http", "$location", function ($scope, $http, $location) {
  	$scope.myTemplate = "";
  	$scope.curColor = "#000000";
  	$scope.curSwatchStyle = {'background-color': '#000000','background-image': 'none'};
  	$scope.imgLoaded = false;

    $scope.swatches = ['8b5e3c','c49a6c','594a42','726658','9b8579','c2b59b','e98c1b','f4cb4b','fffcc0','00658f','93c8d0','911710','d13c39','f9afaf','ee2a7b','662d91','ffffff','d1d3d4','a7a9ac','808285','58595b','000000'];
  	$scope.pictureSwatches = [];

  	$scope.loadTemplate = function () {
	  templateID = getUrlParameter('templateID');

	  if(templateID !== undefined) {
	    loadFromLibrary('../templates/' + templateID + '.html');
	  }
	};

	$scope.switchColor = function (newColor){
	    $scope.curColor = (newColor === 'transparent')? '' : '#'+newColor;

	    if($scope.curColor === '') {
	      $scope.curSwatchStyle = {'background-color': 'transparent','background-image': 'url(\"images/bg.jpg\")'};
	    } else {
	      $scope.curSwatchStyle = {'background-color': $scope.curColor,'background-image': 'none'};
	      $('#currentSwatch').colorpicker('setValue', $scope.curColor);
	    }
	};

	$scope.paintPixels = function (event){
		var self = event.target;
		if(event.type === "mousedown") {
			$scope.mouseDown();
		}

		if($scope.isMouseDown) {
			$(self).attr('bgcolor', $scope.curColor);
		}
	};

	function paletteSizer(size, px) {
	  $('#size-' + size).click(function(){
	    $('td').attr({
	      'width': px,
	      'height': px
	    });
	  	$('#snippet').text($('#snippet2').html().trim());
	  });
	}
	paletteSizer('small', '2');
	paletteSizer('medium', '5');
	paletteSizer('large', '10');

	$scope.showCodeModal = function(){
	  $('#snippet2').html($('#palette').html());
	  $('#snippet').text($('#snippet2').html().trim());
	  $('#codeModal').modal('show');
	};


	// Set background tracing url
	$('#traceBG').change(function(){
		console.log($('#traceBG').val());
		if($('#traceBG').val() !== '') {
		  $('#paletteContainer').addClass('hasTraceBG');
		  $('.hasTraceBG').css('background-image', 'url(' + $(this).val() + ')');
		} else {
		  $('#paletteContainer').removeClass('hasTraceBG');
		  $('#paletteContainer').css('background-image', 'url(../images/bg.jpg)');
		}
	});


	// Download png of generated image
	$("#imgDownload").click(function() {
	  html2canvas($("#snippet2"), {
	    onrendered: function(canvas) {
	      var a = document.createElement('a');
	      a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	      a.download = 'emaildog.png';
	      a.click();
	      //Canvas2Image.saveAsPNG(canvas);
	    }
	  });
	});

    // Save the current state of the pallete to local storage
    $('#savePixels').click(function(){
      var pixels = $('#palette').html().trim();
      localStorage.setItem('pixels', pixels);
    });


    // Load the current state of the pallete from local storage
    $('#loadPixels').click(function() {
      $scope.confirmationModal("Are you sure you want to load from your local storage?", "Keep in mind, there's no way to get your beautiful artwork back, so make sure to save it out first.", "load", loadFromLocalStorage);
    });


    // Reset drawing canvas to blank
    // @TODO add confirmation before clearing
    $('#clearPixels').click(function(){
      $scope.confirmationModal("Are you sure you want to clear the canvas?", "Keep in mind, there's no way to get your beautiful artwork back, so make sure to save it out first.", "clear canvas", loadFromLibrary);
    });

    /** Make swatches work **/
	$('#currentSwatch').colorpicker({
	  create: function() {
	    color: $scope.curColor;
	  }
	});

	$('#currentSwatch').colorpicker().on('changeColor', function(e) {
	  $scope.curColor = e.color.toHex();
	  $scope.curSwatchStyle = {'background-color': $scope.curColor,'background-image': 'none'};
	});

	  // Selects html code snippet on click in text field
	  $('#snippet').click(function(){
	    $(this).select();
	  });

	// "private" functions are not actually private but please think if that like they are.

	function loadFromLibrary(template) {
	  // Limit us to approved templates
	  if(-1 === $scope.templates.indexOf(template)) {
	  	template = 'grid';
	  }

	  $http({
	  	method: 'GET',
	  	url: 'templates/'+template+'.html'
	  }).then(function success(response) {
	  	$scope.myTemplate = response.data;
	  }, function error(response) {
	  	// I don't know what to do here.
	  });
	  console.log("Load from Library Complete");
	}
	loadFromLibrary($location.search()["templateID"]);

	function loadFromLocalStorage(item) {
	  $scope.myTemplate = localStorage.getItem('pixels');
	  console.log("Load from Local Storage Complete");
	}

	$scope.parseColor = function (color, toNumber) 
	{
	  if (toNumber === true) {
	    if (typeof color === 'number') {
	      return (color | 0); //chop off decimal
	    }
	    if (typeof color === 'string' && color[0] === '#') {
	      color = color.slice(1);
	    }
	    return window.parseInt(color, 16);
	  } else {
	    if (typeof color === 'number') {
	      //make sure our hexadecimal number is padded out
	      color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
	    }

	    return color;
	  }
	};

	// Drag and Drop Palette Creator
  $scope.paletteFromImage = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $('.imageUploadContainer').hide();
        $('.imageUploadImage').attr('src', e.target.result);
        $('.imageUploadContent').show();

        var ctimage = $('.imageUploadImage')[0];
        var colorThief = new ColorThief();
        var cp = colorThief.getPalette(ctimage, 15, 6);

        $('#paletteContainer').addClass('hasTraceBG');
        $('.hasTraceBG').css('background-image', 'url(' + e.target.result + ')');

        for(var i=0;i<cp.length;i++) {
          $scope.pictureSwatches.push($scope.parseColor((cp[i][0]<<16) | (cp[i][1]<<8) | cp[i][2], false).substr(-6));

          $('#pictureSwatches').css('display','flex');
        }

        $('.image-title').html(input.files[0].name);
        $scope.imgLoaded = true;
        $scope.$apply();
      };

      reader.readAsDataURL(input.files[0]);

    } else {
      removeUpload();
    }
  }

  $scope.removeUpload = function () {
    $('.imageUploadInput').replaceWith($('.imageUploadInput').clone());
    $('.imageUploadContent').hide();
    $('.imageUploadContainer').removeClass('imageOver').show();
    $('.pictureSwatch').remove();
    $('#paletteContainer').removeClass('hasTraceBG');
    $('#paletteContainer').css('background-image', 'url(../images/bg.jpg)');
    $('#pictureSwatches').css('display','none');
    $scope.imgLoaded = false;
    $scope.pictureSwatches = [];
  }
  $('.imageUploadContainer').bind('dragover', function () {
    $('.imageUploadContainer').addClass('imageOver');
  });
  $('.imageUploadContainer').bind('dragleave', function () {
    $('.imageUploadContainer').removeClass('imageOver');
  });

  }]);
