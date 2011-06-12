// UNCOMMENT THE FOLLOWING LINE IF YOU ARE DEPLOYING TEST VERSIONS.
// alert("We are working on this now. It may contain bugs");

// Not sure what the "correct" way to hook into after twiddla is
// initialized (poking through their code shows some setTimeouts)
// but they eval the response from the first XHR returning the initial
// calls to populate the room and log. So we intercept the first call
// to eval and initialize organicmath just before.
organicmath_initialized = false;
oldEval = eval;
eval = function(expr) {
  if (!organicmath_initialized) {
    initOrganicmath();
    organicmath_initialized = true;
    eval = oldEval;
  }
  oldEval(expr);
};

initOrganicmath = function() {
  document.getElementById('divSideband').style.display = '';

  sendMessage = function(message) {
    var original_message = document.getElementById('txtChat').value;
    document.getElementById('txtChat').value = message;
    sendChat();
    document.getElementById('txtChat').value = original_message;
  };

  sendSideband = function(type) {
    sendMessage(':: ' + type + ' ::');
  };

  originalAppendChatBox = TChat.AppendChatBox;
  TChat.AppendChatBox = 
      function(container, user, text, allowHTML, includeUserIcon, className) {
    if (text.substring(0, 2) === '@@') {
      var command = text.substring(2);
      window[command](user);
    } else {
      // Leave scrollbar in place if you are scrolled up.
      var oldScrollTop = null;
      if (divChat.scrollHeight - divChat.scrollTop !== 200 /*#MagicConstant*/) {
        oldScrollTop = divChat.scrollTop
      }

      originalAppendChatBox(
          container, user, text, allowHTML, includeUserIcon, className);

      if (oldScrollTop) {
        divChat.scrollTop = oldScrollTop;
      }
    }
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

  old_chat_text = '';

  setInterval(function() {
    chat_text = document.getElementById('txtChat').value;    
    if (old_chat_text === '' && chat_text !== '') {
      sendMessage('@@startTyping');      
    }
    if (old_chat_text !== '' && chat_text === '') {
      sendMessage('@@stopTyping');
    }

    old_chat_text = chat_text;
  }, 1000);
};

startTyping = function(user) {
  user.is_typing = true;
  RefreshUsers();
};

stopTyping = function(user) {
  user.is_typing = false;
  RefreshUsers();
};
