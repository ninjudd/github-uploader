function makeDOMVars(){
  // Variables
  $.gub.$overlay      = $("<div id='gub-overlay'>").css({ position: 'fixed', top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", zIndex: 10, fontFamily: 'Arial' });
  $.gub.$pseudoBody   = $("<div id='gub-pseudo-body'>").css({ margin: '100px auto', width: 500, border: '5px solid #eee', padding: '0 20px 20px 20px', background: 'white' });
  $.gub.$content      = $("<div id='gub-content'>").html(" <h2>Upload a file to Github</h2>").css({ position: 'relative' });
  $.gub.$closeMsg     = $("<div id='gub-close-msg'>").css({ position: 'absolute', top: -10, right: -10, fontSize: 9, color: '#aaa' }).text('Press [Esc] to close');
  $.gub.$path         = $("<input id='gub-path' type='input' name='path' placeholder='path/to'>").css({ width: '100%', fontSize: 14, padding: 3, marginBottom: 10  });
  $.gub.$file         = $("<input id='gub-file' type='file' name='file' size='200'>").css({ margin: '10px auto', width: 175 });
  $.gub.$dropzone     = $("<div id='gub-dropzone'>").css({width: '100%', height: 100, background: '#B1DEF2', textAlign: 'center', paddingTop: 20, border: '1px solid #ccc', cursor: 'pointer'}).html("<h1>Drag file here</h1>");
}

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
  $.gub.$path.keyup(function(){
    $.gub.data.path = $(this).val();
    $.gub.$file.fileupload( 'option', 'formData', $.gub.data);
  });
}

function bindFileUpload(){
  $.gub.$file.fileupload({
      url: $.gub.origin + "/upload",
      formData: $.gub.data,
      dropZone: $.gub.$dropzone,
      start: function(){
        $('h1', $.gub.$dropzone).text('uploading...');
      },
      done: function (e, data) {
        $('h1', $.gub.$dropzone).text('Drag file here');
        handleReturnedFileData( JSON.parse(data.result) );
      }
  });

}

function bindEsc(){
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {  // esc key
      toggle();
    } 
  });
}

function handleReturnedFileData(data){
  var markdown = "[" + data.file + "](" + data.url + ")";
  re = /image/;
  if (re.exec(data.type)) markdown = "!" + markdown; 

  var $textArea = $('textarea:visible').first();

  if ($textArea.length > 0){
    var oldText   = $textArea.val();
    oldText       = (oldText.length > 0) ?  oldText + "\n" : oldText;
    var newText   =  oldText + markdown; 
    $textArea.val(newText).focus();
    $textArea[0].selectionStart = newText.length;
    toggle();
  }
  else{
    var $result = $("<input type='text' class='gub-pasty-result'>").css({ width: '100%', border: '1px solid #ddd', marginTop: 10, padding: 5, fontSize: 16 }).val(markdown);
    $.gub.$content.append($result);
    $result.focus().select();
  }
}

function toggle(){
  $.gub.$overlay.toggle();
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
    makeDOMVars();
    $.gub.$content.append($.gub.$path);
    $.gub.$content.append($.gub.$file);
    $.gub.$content.append($.gub.$dropzone);
    $.gub.$dropzone.append($.gub.$file);
    $.gub.$content.append($.gub.$closeMsg);
    $.gub.$overlay.append($.gub.$pseudoBody);
    $.gub.$pseudoBody.append($.gub.$content);
    $('body').append($.gub.$overlay);
    disableBrowserDrop();
    bindFileUpload();
    bindInputChange();
    bindEsc();
}

// Grab jquery UI and get the ball rollin'
if ($.gub.alive) {
  $('.gub-pasty-result').hide();
  toggle();
}
else{
  $.ajax({
    url: "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js",
    dataType: "script",
    success: function(){
      $.gub.alive = true;
      getFileUploadJS();
    }
  });
}