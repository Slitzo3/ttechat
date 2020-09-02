const client = require("socket.io").listen(process.env.PORTSOCKET).sockets;

module.exports = function start(db) {
  // Connect to Socket.io
  client.on("connection", (socket) => {
    let chat = db.collection("chats");

    // Create function to send status
    sendStatus = (s) => {
      socket.emit("status", s);
    };

    // Get chats from mongo collection
    chat.find().limit(20).sort({ timestamp: -1 }).toArray((err, res) => {
      if (err) {
        throw err;
      }

      // Emit the messages
      socket.emit("output", res);
    });

    // Handle input events
    socket.on("input", (data) => {
      let name = data.name;
      let message = data.message;
      let timestamp = new Date();

      // Check for name and message
      if (message == "") {
        // Send error status
        sendStatus("Please enter a message");
      } else {
        // Insert message
        chat.insertOne(
          { name: name, message: message, timestamp: timestamp },
          () => {
            client.emit("output", [data]);

            // Send status object
            sendStatus({
              message: "Message sent",
              clear: true,
            });
          },
        );
      }
    });
  });
};
