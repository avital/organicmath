document.getElementById('divSideband').style.display = '';

sendSideband = function(type) {
  document.getElementById('txtChat').value = ':: ' + type + ' ::'; sendChat();
}

