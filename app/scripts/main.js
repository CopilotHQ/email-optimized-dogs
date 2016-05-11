var color = '#000000',
    theCanvas,
    templateID,
    swatches = ['8b5e3c','c49a6c','594a42','726658','9b8579','c2b59b','e98c1b','f4cb4b','fffcc0','00658f','93c8d0','911710','d13c39','f9afaf','ee2a7b','662d91','ffffff','d1d3d4','a7a9ac','808285','58595b','000000'
                ];

$(document).ready(function(){
  var sourceImage = $(".dogLogo")[0],
      colorThief = new ColorThief();
  console.log(colorThief.getColor(sourceImage));

  // Load table grid
  $('#palette').load('components/grid.html', function(){
    refreshAreas();
  });

  /** Make swatches work **/
  $('#currentSwatch').colorpicker().on('changeColor', function(e) {
    $('#currentSwatch').css('background-color', e.color.toHex());
    $('#cp1').val(e.color.toHex());
    color = e.color.toHex();
  });

  $('#cp1').change(function(){
    $('#currentSwatch').css('background-color', $('#cp1').val());
    color = $('#cp1').val();
  });


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


  // Create palette from swatches
  for (var i = 0; i < swatches.length; i++) {
    $('<div class="swatch" style="background: #' + swatches[i] + '" data-color="' + swatches[i] + '"></div>').appendTo('#swatches');
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
    loadFromLibrary('../templates/' + templateID + '.html')
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
        'background': color,
        'background-image': 'none'
      });
      $('#cp1').val(color);
    }
    console.log(color);
  });
}

function paintPixels(){
  var isMouseDown = false;
  var paint = function(self){
    if(color == 'transparent') {
      $(self).attr({
        'bgcolor': '',
      });
    } else {
      $(self).attr('bgcolor', color);
    }
    refreshAreas();
  };

  $('body').on('mousedown', '#palette td', function() {
    isMouseDown = true;
    paint(this);
  })
  .on("mousemove","#palette td",function(){
    if(isMouseDown)
      paint(this);
  })
  .on("mouseup",function(){
    isMouseDown = false;
  });
}

function paletteSizer(size, px) {
  $('#size-' + size).click(function(){
    $('td').attr({
      'width': px,
      'height': px
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
  $('#snippet').text($('#palette').html().trim());
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


// Open code modal
$('#getCode').on('click', function(){
  $('#codeModal').modal('show');
});

// Open confirmation modal
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


// Translate RGB to Hex
function rgbToHex(col)
{
  if(col.charAt(0)=='r') {
    col=col.replace('rgb(','').replace(')','').split(',');
    var r=parseInt(col[0], 10).toString(16);
    var g=parseInt(col[1], 10).toString(16);
    var b=parseInt(col[2], 10).toString(16);
    r=r.length==1?'0'+r:r; g=g.length==1?'0'+g:g; b=b.length==1?'0'+b:b;
    var colHex='#'+r+g+b;
    return colHex;
  }
}
