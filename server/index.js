const express = require("express"); // using 'require' and not 'import' because we are in node here
const socket_io = require("socket.io");
const http = require("http");
const router = require("./router");

// importing helper functions
const {
  add_user,
  get_user,
  get_users_in_room,
  remove_user,
} = require("./users.js");

const PORT = process.env.PORT || 5001;

// initialize server
const app = express();
const server = http.createServer(app);

// initialize we socket
const io = socket_io(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// on even that connection is ready
io.on("connection", (socket) => {
  console.log("Web Socket in Open!");

  // when a user joins the web socket connection
  socket.on("join", ({ name, room }, callback) => {
    // socket.id = a specific ID for each user using this socket
    const { user, error } = add_user({ id: socket.id, name, room });

    // error handling
    if (error) return callback(error);

    // emit a system welcome message -> only the user itself can see that
    // this is from backend to front end (emit)
    socket.emit("admin message", {
      user: "admin",
      text: `Hey ${user.name}! Welcome to ${user.room}`,
    });

    // broadcast is a method to send a message to everyone except the user
    socket.broadcast.to(user.room).emit("admin message", {
      user: "admin",
      message: `${user.name} had joined the room`,
    });

    // join method - a built in method of socket.io
    socket.join(user.room);

    // success
    callback();
  });

  // listening to user messages from the front end
  socket.on("user message", (message, callback) => {
    const user = get_user(socket.id);

    // send message to the whole room. Using 'io' as its the "parent" of the entire socket
    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("DISCONNECT", () => {
    console.log("User left :(, we socket closed");
  });
});

// using routing created in router.js
app.use(router);

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}.`));
