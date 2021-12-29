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
  // console.log("Web Socket in Open!");

  // when a user joins the web socket connection
  socket.on("join", ({ name, room }, callback) => {
    //console.log("recieved a Join event")
    // socket.id = a specific ID for each user using this socket
    const { user, error } = add_user({ id: socket.id, name, room });

    // error handling
    if (error) return callback(error);

    // emit a system welcome message -> only the user itself can see that
    // this is from backend to front end (emit)
    socket.emit("message", {
      user: "admin",
      text: `Hey ${user.name}! Welcome to ${user.room}`,
    });

    // broadcast is a method to send a message to everyone except the user
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} had joined the room`,
    });

    // join method - a built in method of socket.io
    socket.join(user.room);

    // send to client side all users in the room
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: get_users_in_room(user.room),
    });

    // success
    callback();
  });

  // listening to user messages from the front end
  socket.on("user message", (message, callback) => {
    //console.log('Recieved a user message on the backend');
    const user = get_user(socket.id);
    // console.log(`User is: ${user}`);
    // send message to the whole room. Using 'io' as its the "parent" of the entire socket
    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User left");

    // when disconnecting from the page the user will be removed from the users array
    const user = remove_user(socket.id);
    if (user) {
      // console.log(`User name: ${user.name} is and room is ${user.room}`);
    }
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the room.`,
      });

      // update users data in the room as well
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: get_users_in_room(user.room),
      });
    }
  });
});

// using routing created in router.js
app.use(router);

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}.`));
