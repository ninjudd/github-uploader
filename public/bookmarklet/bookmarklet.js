// Variables
var $overlay      = $("<div id='gub-overlay'>").css({ position: 'absolute', top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", zIndex: 10, fontFamily: 'Arial' });
var $pseudoBody   = $("<div id='gub-pseudo-body'>").css({ margin: '100px auto', width: 500, border: '5px solid #eee', padding: '0 20px 20px 20px', background: 'white' });
var $content      = $("<div id='gub-content'>").html(" <h2>Upload a file to Github</h2>").css({ position: 'relative' });
var $closeMsg     = $("<div id='gub-close-msg'>").css({ position: 'absolute', top: -10, right: -10, fontSize: 9, color: '#aaa' }).text('Press [Esc] to close');
var $path         = $("<input id='gub-path' type='input' name='path' placeholder='path/to'>").css({ width: '100%', fontSize: 14, padding: 3, marginBottom: 10  });
var $file         = $("<input id='gub-file' type='file' name='file' size='300'>").css({ display: 'none' });
var $dropzone     = $("<div id='gub-dropzone'>").css({width: '100%', height: 100, background: '#B1DEF2', textAlign: 'center', paddingTop: 20, border: '1px solid #ccc', cursor: 'pointer'}).html("<h1>Click or drag files here</h1>");

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
  $file.fileupload({
      url: $.gub.origin + "/upload",
      formData: $.gub.data,
      dropZone: $dropzone,
      start: function(){
        $dropzone.html('<h1>uploading...</h1>');
      },
      done: function (e, data) {
        $dropzone.html('<h1>Click or drag files here</h1>');
        handleReturnedFileData( JSON.parse(data.result) );
      }
  });

  $dropzone.click(function(){
    $file.click();
  });

}

function bindEsc(){
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {  // esc key
      close();
    } 
  });
}

function handleReturnedFileData(data){
  var markdown = "[" + data.file + "](" + data.url + ")";
  re = /image/;
  if (re.exec(data.type)) markdown = "!" + markdown; 

  var $textArea = $('textarea:visible').first();
  var oldText   = $textArea.val();
  var newText   = oldText + "\n" + markdown; 
  $textArea.val(newText).focus();
  $textArea[0].selectionStart = newText.length;
  close();
}

function close(){
  $overlay.remove();
}

function disableBrowserDrop(){
  $(document).bind('drop dragover', function (e) {
    e.preventDefault();
  });
}

function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function main(){
  $content.append($path);
  $content.append($file);
  $content.append($dropzone);
  $content.append($closeMsg);
  $overlay.append($pseudoBody);
  $pseudoBody.append($content);
  $('body').append($overlay);
  disableBrowserDrop();
  bindFileUpload();
  bindEsc();
}