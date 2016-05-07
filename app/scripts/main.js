var color = '#000000',
    theCanvas,
    templateID,
    swatches = ['000000', '595f68', '848c96', 'ffffff',
                '660000', '990000', 'FF0000', 'FF6666', 'FFCCCC',
                '666600', '999900', 'FFFF00', 'FFFF66', 'FFFFCC',
                '006600', '009900', '00FF00', '66FF66', 'CCFFCC',
                '006666', '009999', '00FFFF', '66FFFF', 'CCFFFF',
                '000066', '000099', '0000FF', '6666FF', 'CCCCFF',
                '660066', '990099', 'FF00FF', 'FF66FF', 'FFCCFF',
                'dcc285'
                ];

$(document).ready(function(){
  // Load table grid
  $('#palette').load('components/grid.html', function(){
    refreshAreas();
  });

  // Make swatches work
  $('#currentSwatch').colorpicker().on('changeColor', function(e) {
    $('#currentSwatch').css('background-color', e.color.toHex());
    $('#cp1').val(e.color.toHex());
    color = e.color.toHex();
  });

  $('#cp1').change(function(){
    $('#currentSwatch').css('background-color', $('#cp1').val());
    color = $('#cp1').val();
  });


  // Create palette from swatches
  for (var i = 0; i < swatches.length; i++) {
    $('<div class="swatch" data-color="' + swatches[i] + '"></div>').appendTo('#swatches');
  }


  // Selects html code snippet on click in text field
  $('#snippet').click(function(){
    $(this).select();
  })

  switchColor();
  paintPixels();

  paletteSizer('small', '2');
  paletteSizer('medium', '5');
  paletteSizer('large', '10');

  loadTemplate();

  refreshAreas();

  return false;
});

function loadTemplate() {
  templateID = getUrlParameter('templateID');

  if(templateID !== undefined) {
    loadFromLibrary('../templates/dogs/' + templateID + '.html')
  }
}

function switchColor(){
  $('body').on('click', '.swatch', function() {
    color = $(this).data('color');
    $('.swatch').removeClass('selectedSwatch');
    $(this).addClass('selectedSwatch');

    if(color == 'transparent') {
      $('#currentSwatch').css({
        'background-color': 'transparent',
        'background-image': 'url("images/bg.jpg")'
      });
      console.log(color);
    } else {
      color = '#' + $(this).data('color');
      $('#currentSwatch').css({
        'background-color': color,
        'background-image': 'none'
      });
    }
    console.log(color);
  });
}

function paintPixels(){
  $('body').on('click', '#palette td', function(){
    if(color == 'transparent') {
      $(this).css({
        'background-color': '',
      });
    } else {
      $(this).css('background-color', color);
    }
    refreshAreas();
  });
}

function paletteSizer(size, px) {
  $('#size-' + size).click(function(){
    $('td').css({
      'width': px + 'px',
      'height': px + 'px'
    });
    refreshAreas();
  });
}


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


// Update html in Get Code preview and html textfield
function refreshAreas(){
  $('#snippet2').html($('#palette').html())
  $('#snippet').text($('#palette').html());
  return false;
}


// Save the current state of the pallete to local storage
$('#savePixels').click(function(){
  var pixels = $('#snippet').val();
  localStorage.setItem('pixels', pixels);
  refreshAreas();
});


// Load the current state of the pallete from local storage
$('#loadPixels').click(function() {
  confirmationModal("Are you sure you want to load from your local storage?", "Keep in mind, there's no way to get your beautiful artwork back, so make sure to save it out first.", "load", "loadFromLocalStorage()");
});


// Reset drawing canvas to blank
// @TODO add confirmation before clearing
$('#clearPixels').click(function(){
  confirmationModal("Are you sure you want to clear the canvas?", "Keep in mind, there's no way to get your beautiful artwork back, so make sure to save it out first.", "clear canvas", "loadFromLibrary('components/grid.html')");
});

// Open confirmatino modal
function confirmationModal(headline, message, button, func){
  $('#confirmationModal #confirmationModal-header').html(headline);
  $('#confirmationModal #confirmationModal-body').html(message);
  $('#confirmationModal #confirmationModal-button').html(button);
  $('#confirmationModal #confirmationModal-button').attr('onclick', func);
  $('#confirmationModal').modal('show');
}


// Clear drawing area
function loadFromLibrary(template) {
  $('#palette').load(template, function() {
    $('#confirmationModal').modal('hide');
    refreshAreas();
  });
}

function loadFromLocalStorage(item) {
  $('#palette').html(localStorage.getItem('pixels'));
  $('#confirmationModal').modal('hide');
  refreshAreas();
}



// Get URL params
  var getUrlParameter = function getUrlParameter(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');

          if (sParameterName[0] === sParam) {
              return sParameterName[1] === undefined ? true : sParameterName[1];
          }
      }
  };
