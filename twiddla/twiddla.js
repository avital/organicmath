// TODO: Find the proper event to fire on rather than use setTimeout
setTimeout(function() {
  document.getElementById('divSideband').style.display = '';

  sendSideband = function(type) {
    document.getElementById('txtChat').value = ':: ' + type + ' ::';
    sendChat();
  };
}, 5000);

// TODO: Eliminate setTimeout!
setTimeout(function() {
  originalAppendChatBox = TChat.AppendChatBox;
  TChat.AppendChatBox = 
      function(container, user, text, allowHTML, includeUserIcon, className) {
    if (text.substring(0, 2) === '@@') {
      var command = text.substring(2);
      window[command](user);
    }

    originalAppendChatBox(
        container, user, text, allowHTML, includeUserIcon, className);
  };

  originalAppendUserRow = TChat.AppendUserRow;
  TChat.AppendUserRow = function(container, user) {
    originalAppendUserRow(container, user);
    var user_div = container.lastChild;
    if (user.is_typing) {
      user_div.style.backgroundColor = '#287593';
    } else {
      user_div.style.backgroundColor = '';
    }
  };
}, 8000);

starttyping = function(user) {
  user.is_typing = true;
  RefreshUsers();
};

stoptyping = function(user) {
  user.is_typing = false;
  RefreshUsers();
};
