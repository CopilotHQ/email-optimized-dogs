var color = '#000000',
    swatches = ['000000', '595f68', '848c96', 'ffffff',
                '934a4a', 'ff2c2c', 'db8494',
                'dcc285', 'ffff00',
                '2cff2c',
                '4a2cff'
                ];

$(document).ready(function(){
  $('#palette').load('components/grid.html', function(){
    refreshAreas();
  });

  for (var i = 0; i < swatches.length; i++) {
    $('<div class="swatch" data-color="' + swatches[i] + '"></div>').appendTo('#swatches');
  }

  /** @todo: Finish this
  if(!localStorage.getItem('pixels')){
    $('#loadPixels').addClass('disabled');
  }
  **/

  $('#snippet').click(function(){
    $(this).select();
  })

  switchColor();
  paintPixels();

  paletteSizer('small', '2');
  paletteSizer('medium', '5');
  paletteSizer('large', '10');

  refreshAreas();

  return false;
});

function switchColor(){
  $('body').on('click', '.swatch', function() {
    color = $(this).data('color');
    if(color == 'transparent') {
      $('#selectedSwatch').css({
        'background-color': 'transparent',
        'background-image': 'url("images/bg.jpg")'
      });
      console.log(color);
    } else {
      color = '#' + $(this).data('color');
      $('#selectedSwatch').css({
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

function refreshAreas(){
  $('#snippet2').html($('#palette').html())
  $('#snippet').text($('#palette').html());
  return false;
}

$('#savePixels').click(function(){
  var pixels = $('#snippet').val();
  localStorage.setItem('pixels', pixels);
  refreshAreas();
});

$('#loadPixels').click(function() {
  $('#palette').html(localStorage.getItem('pixels'));
  refreshAreas();
});

$('#dog_001Pixels').click(function(){
  $('#palette').load('../templates/dogs/dog_001.html', function(){
    refreshAreas();
  });
});

$('#dog_002Pixels').click(function(){
  $('#palette').load('../templates/dogs/dog_002.html', function(){
    refreshAreas();
  });
});

$('#clearPixels').click(function(){
  $('#palette').load('components/grid.html', function() {
    refreshAreas();
  });
});
