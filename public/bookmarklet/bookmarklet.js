// Variables
// var data = { secret: 'secret', author: 'Justin Balthrop <git@justinbalthrop.com>'};

// Grab jquery UI
$.ajax({
  url: "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js",
  dataType: "script",
  success: function(){
    getFileUploadJS();
  }
});


// Grab fileupload.js
function getFileUploadJS(){
  $.ajax({
    url: "https://raw.github.com/blueimp/jQuery-File-Upload/master/js/jquery.fileupload.js",
    dataType: "script",
    success: function(){
      main();
    }
  });
}

function bindInputChange(){
  $('#path').change(function(){
    $.gub.data.path = $(this).val();
    $("#file").fileupload( 'option', 'formData', $.gub.data);
  });
}

function bindFileUpload(){

  $("#file").fileupload({
      url: window.location.protocol + "//" + window.location.host + "/upload",
      formData: $.gub.data,
      done: function (e, data) {
        console.log(data.result);
      }
  });
}

function bindEsc(){
  $(document).keyup(function(e) {
    if (e.keyCode == 27) { 
      $("#overlay").remove();
    }   // esc
  });
}

function main(){
  var $overlay      = $("<div id='overlay'>").css({ position: 'absolute', top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.75)", zIndex: 10, fontFamily: 'Arial' });
  var $pseudoBody   = $("<div id='pseudo-body'>").css({ margin: '100px auto', width: 500, border: '5px solid #eee', padding: '0 20px 20px 20px', background: 'white' });
  var $form         = $("<div id='content'>").html(" <h2>Upload a file to Github: </h2>");
  var $path         = $("<input id='path' type='input' name='path' placeholder='path/to'>").css({ width: '100%', fontSize: 14, padding: 3, marginBottom: 10  });
  var $file         = $("<input id='file' type='file' name='file' size='300'>").css({width: '100%'});

  $form.append($path);
  $form.append($file);
  $overlay.append($pseudoBody);
  $pseudoBody.append($form);
  $('body').append($overlay);
  bindFileUpload();
  bindEsc();
}