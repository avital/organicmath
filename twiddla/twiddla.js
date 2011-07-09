// UNCOMMENT THE FOLLOWING LINE IF YOU ARE DEPLOYING TEST VERSIONS.
alert("We are working on this now. It may have bugs.");

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
  // Hand, Agree, Thank, Laugh are hidden by default, so show them...
  document.getElementById('divSideband').style.display = '';

  // change the thank icon to read 'Thinking', and send appropriate message
  var thankEl = document.getElementById('divSideband').children[2];
  thankEl.onclick = function(){sendSideband('thinking')};
  thankEl.innerHTML = thankEl.innerHTML.replace('Thank','Thinking');
  thankEl.style.setProperty("width", "75px", null);

  // change the thank icon to read 'Thinking', and send appropriate message
  var awayEl = document.getElementById('divSideband').children[3];
  awayEl.onclick = function(){sendSideband('away')};
  awayEl.innerHTML = awayEl.innerHTML.replace('Laugh', 'Away');
//  awayEl.style.setProperty("width", "75px", null);

  sendMessage = function(message) {
    var original_message = document.getElementById('txtChat').value;
    document.getElementById('txtChat').value = message;
    sendChat();
    document.getElementById('txtChat').value = original_message;
  };

  sendSideband = function(type) {
    if (type === 'away') {
      sendMessage('@@away');
    }
    else {
      sendMessage(':: ' + type + ' ::');
    }
  };

  setBack = function() {
    if (TChat.currentUser.is_away) {
      sendMessage('@@back');
      TChat.currentUser.is_away = false;
    }
  };

  document.onmousedown = setBack;
  document.onkeydown = setBack;
  document.onmouseup = setBack;
  document.getElementById('frameSubject').contentWindow.document.onmouseup = setBack;
  document.getElementById('frameSubject').contentWindow.document.ondragend = setBack;
  document.getElementById('frameSubject').contentWindow.document.ondragstart = setBack;
  document.getElementById('frameSubject').contentWindow.document.onmousedown = setBack;
  document.getElementById('frameSubject').contentWindow.document.getElementById('slideCover').ondragstart = function() {};
  document.getElementById('frameSubject').contentWindow.document.getElementById('slideCover').onmouseup = setBack;

  originalAppendChatBox = TChat.AppendChatBox;
  TChat.AppendChatBox =
      function(container, user, text, allowHTML, includeUserIcon, className) {
    if (text.substring(0, 2) === '@@') {
      // allow special operations (IE: for the typing indicator)
      var command = text.substring(2);
      window[command](user);
    } else {
      // Leave scrollbar in place if you are scrolled up.
      var oldScrollTop = null;

      if (divChat.scrollHeight - divChat.scrollTop > 220 /*#MagicConstant*/) {
        oldScrollTop = divChat.scrollTop;
      }

      originalAppendChatBox(
          container, user, text, allowHTML, includeUserIcon, className);

      if (oldScrollTop) {
        divChat.scrollTop = oldScrollTop;
      }
    }
  };

  makeLinkSane = function(element) {
    element.onclick = null;
    element.target = '_blank';
  };

  normalize = function() {
	var container = divChat;
    var elements = container.getElementsByTagName('a');
    for (var i = 0; i < elements.length; i++) {
  	  var element = elements[i];

      if (element.innerHTML === '- load as background image') {
        element.innerHTML = '';
      } else if (element.innerHTML === '- view original') {
        element.innerHTML = '- revert to this image (will clear whiteboard)';
      } else if (element.className === 'snaplink') {
		makeLinkSane(element);
	  } else if (element.parentNode.className === 'chatmessage') {
		makeLinkSane(element);
		// TODO: Do this in CSS (for performance)
		element.parentNode.style.overflowX = 'hidden';
      }
	}
  };

  originalPostProcessChatMessage = TChat.PostProcessChatMessage;
  TChat.PostProcessChatMessage = function(container) {
    originalPostProcessChatMessage(container);
    normalize();
  };

  originalAppendSnapshotBox = TChat.AppendSnapshotBox;
  TChat.AppendSnapshotBox = function(container, user, actionID, thumbUrl, snapshotName) {
	originalAppendSnapshotBox(container, user, actionID, thumbUrl, snapshotName);
    normalize();	
  };

  normalize();

  originalAppendUserRow = TChat.AppendUserRow;
  TChat.AppendUserRow = function(container, user) {
    originalAppendUserRow(container, user);
    var user_div = container.lastChild;
    if (user.is_typing) {
      user_div.style.backgroundColor = '#287593';
    } else {
      user_div.style.backgroundColor = '';
    }

    if (user.is_away) {
      user_div.appendChild(document.createTextNode(' (away)'));
    }
  };

/*
  document.getElementById('framePop').contentWindow.location 
    = '/AddIns/SnapshotPanel.aspx?sessionID=' + sessionID;
  upload_callback = function() {};
  openPop = function() {
    document.getElementById('framePop').contentWindow.document
        .getElementById('bugForm').submit();
  };
  MediaTab_init = function() {};
*/

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
  }, 50);
};

startTyping = function(user) {
  user.is_typing = true;
  RefreshUsers();
};

stopTyping = function(user) {
  user.is_typing = false;
  RefreshUsers();
};

away = function(user) {
  user.is_away = true;
  RefreshUsers();
};

back = function(user) {
  user.is_away = false;
  RefreshUsers();
};
