window.addEventListener('error', function(e) {
  document.body.innerHTML += '<div style="position:fixed;top:0;left:0;background:red;color:white;z-index:9999;padding:20px;">' + e.message + '<br/>' + e.filename + ':' + e.lineno + '</div>';
});
