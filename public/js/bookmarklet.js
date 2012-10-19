function makeDOMVars(){
  // Variables
  jQuery.gub.$overlay      = jQuery("<div id='gub-overlay'>").css({ position: 'fixed', top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", zIndex: 10, fontFamily: 'Arial' });
  jQuery.gub.$pseudoBody   = jQuery("<div id='gub-pseudo-body'>").css({ margin: '100px auto', width: 500, border: '5px solid #eee', padding: '0 20px 20px 20px', background: 'white' });
  jQuery.gub.$content      = jQuery("<div id='gub-content'>").html(" <h2>Upload a file to Github</h2>").css({ position: 'relative' });
  jQuery.gub.$closeMsg     = jQuery("<div id='gub-close-msg'>").css({ position: 'absolute', top: -10, right: -10, fontSize: 9, color: '#aaa' }).text('Press [Esc] to close');
  jQuery.gub.$path         = jQuery("<input id='gub-path' type='input' name='path' placeholder='path/to'>").css({ width: '100%', fontSize: 14, padding: 3, marginBottom: 10  });
  jQuery.gub.$file         = jQuery("<input id='gub-file' type='file' name='file' size='200'>").css({ margin: '10px auto', width: 175 });
  jQuery.gub.$dropzone     = jQuery("<div id='gub-dropzone'>").css({width: '100%', height: 100, background: '#B1DEF2', textAlign: 'center', paddingTop: 20, border: '1px solid #ccc', cursor: 'pointer'}).html("<h1>Drag file here</h1>");
}

// Grab fileupload.js
function getFileUploadJS(){
  jQuery.ajax({
    url: "https://www.geni.com/javascripts/jq.lib.fileupload.js",
    dataType: "script",
    success: function(){
      main();
    }
  });
}

function bindInputChange(){
  jQuery.gub.$path.keyup(function(){
    jQuery.gub.data.path = jQuery(this).val();
    jQuery.gub.$file.fileupload( 'option', 'formData', jQuery.gub.data);
  });
}

function bindFileUpload(){
  jQuery.gub.$file.fileupload({
      url: jQuery.gub.origin + "/upload",
      formData: jQuery.gub.data,
      dropZone: jQuery.gub.$dropzone,
      start: function(){
        jQuery('h1', jQuery.gub.$dropzone).text('uploading...');
      },
      done: function (e, data) {
        jQuery('h1', jQuery.gub.$dropzone).text('Drag file here');
        handleReturnedFileData( JSON.parse(data.result) );
      }
  });

}

function bindEsc(){
  jQuery(document).keyup(function(e) {
    if (e.keyCode == 27) {  // esc key
      toggle();
    } 
  });
}

function handleReturnedFileData(data){
  var markdown = "[" + data.file + "](" + data.url + ")";
  re = /image/;
  if (re.exec(data.type)) markdown = "!" + markdown; 

  var $textArea = jQuery('textarea:visible').first();

  if ($textArea.length > 0){
    var oldText   = $textArea.val();
    oldText       = (oldText.length > 0) ?  oldText + "\n" : oldText;
    var newText   =  oldText + markdown; 
    $textArea.val(newText).focus();
    $textArea[0].selectionStart = newText.length;
    toggle();
  }
  else{
    var $result = jQuery("<input type='text' class='gub-pasty-result'>").css({ width: '100%', border: '1px solid #ddd', marginTop: 10, padding: 5, fontSize: 16 }).val(markdown);
    jQuery.gub.$content.append($result);
    $result.focus().select();
  }
}

function toggle(){
  jQuery.gub.$overlay.toggle();
}

function disableBrowserDrop(){
  jQuery(document).bind('drop dragover', function (e) {
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
    jQuery.gub.$content.append(jQuery.gub.$path);
    jQuery.gub.$content.append(jQuery.gub.$file);
    jQuery.gub.$content.append(jQuery.gub.$dropzone);
    jQuery.gub.$dropzone.append(jQuery.gub.$file);
    jQuery.gub.$content.append(jQuery.gub.$closeMsg);
    jQuery.gub.$overlay.append(jQuery.gub.$pseudoBody);
    jQuery.gub.$pseudoBody.append(jQuery.gub.$content);
    jQuery('body').append(jQuery.gub.$overlay);
    disableBrowserDrop();
    bindFileUpload();
    bindInputChange();
    bindEsc();
}

// Grab jquery UI and get the ball rollin'
if (jQuery.gub.alive) {
  jQuery('.gub-pasty-result').hide();
  toggle();
}
else{
  jQuery.ajax({
    url: "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js",
    dataType: "script",
    success: function(){
      jQuery.gub.alive = true;
      getFileUploadJS();
    }
  });
}