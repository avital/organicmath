alert('This is being worked-on right now. It may have bugs.');

// TODO: Find the proper event to fire on rather than use setTimeout
setTimeout(function() {
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
}, 5000);

cleanProtocol = function() {
  document.getElementById('divChat').innerHTML = 
      document.getElementById('divChat').innerHTML
          .replace(/@@stopTyping\<br\>/g, '')
          .replace(/@@stopTyping\<\/div\>/g, '</div>')
          .replace(/@@startTyping\<br\>/g, '');
};



/*
<div class="chatmessage">@@startTyping<br>@@stopTyping<br>@@startTyping<br>@@stopTyping<br>sdfd<br>a<br>b<br>c<br>@@startTyping<br>dsadsa<br>@@stopTyping<br>asfd<br>@@startTyping<br>mkl<br>@@stopTyping<br>jkljkl<br>@@startTyping<br>jl<br>@@stopTyping<br>jiojio<br>jo</div>


*/


// TODO: Eliminate setTimeout!
setTimeout(function() {
// If we call this is works but then you can't see any new chat messages
  cleanProtocol();

  originalAppendChatBox = TChat.AppendChatBox;
  TChat.AppendChatBox = 
      function(container, user, text, allowHTML, includeUserIcon, className) {
    if (text.substring(0, 2) === '@@') {
      var command = text.substring(2);
      window[command](user);
    } else {
      originalAppendChatBox(
          container, user, text, allowHTML, includeUserIcon, className);
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
}, 8000);

startTyping = function(user) {
  user.is_typing = true;
  RefreshUsers();
};

stopTyping = function(user) {
  user.is_typing = false;
  RefreshUsers();
};
