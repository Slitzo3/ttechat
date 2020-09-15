let element = function (id) {
  return document.getElementById(id);
};

// Get Elements
var status = element('status');
var messages = element('messages');
var textarea = element('textarea');
var username = element('username').innerText;
var clearBtn = element('clear');

// Set default status
let statusDefault = status.textContent;

let setStatus = function (s) {
  // Set status
  status.textContent = s;

  if (s !== statusDefault) {
    setTimeout(function () {
      setStatus(statusDefault);
    }, 4000);
  }
};

// Connect to socket.io
var socket = io.connect(`http://127.0.0.1:` + 4000);

// Check for connection
if (socket !== undefined) {
  // Handle Output
  socket.on('output', function (data) {
    //console.log(data);
    if (data.length) {
      for (var x = 0; x < data.length; x++) {
        let date = new Date(data[x].timestamp);
        messages.scrollTop = messages.scrollHeight;
        // Build out message div
        var message = document.createElement('div');
        //Give the div a class
        message.setAttribute('class', 'chat-message');
        //Some style
        message.setAttribute('style', 'margin-bottom: 20px;');
        //Send out the message aka print it out
        message.textContent =
          date.toLocaleDateString() + ' | ' + data[x].name + ': ' + data[x].message;
        //Append it
        messages.appendChild(message);
        //
        messages.insertBefore(message, messages.firstChild);
      }
    }
  });

  // Get Status From Server
  socket.on('status', function (data) {
    // get message status
    setStatus(typeof data === 'object' ? data.message : data);

    // If status is clear, clear text
    if (data.clear) {
      textarea.value = '';
    }
  });

  // Handle Input
  textarea.addEventListener('keydown', function (event) {
    if (event.which === 13 && event.shiftKey == false) {
      // Emit to server input
      socket.emit('input', {
        name: username,
        message: textarea.value,
        timestamp: new Date(),
      });

      event.preventDefault();
    }
  });
}
