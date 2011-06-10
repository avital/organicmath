// TODO: Find the proper event to fire on rather than use setTimeout
setTimeout(function() {
  document.getElementById('divSideband').style.display = '';

  sendSideband = function(type) {
    document.getElementById('txtChat').value = ':: ' + type + ' ::';
    sendChat();
  };
}, 5000);

