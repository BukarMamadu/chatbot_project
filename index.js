const express = require("express");
const sketio = require("socket.io");

const path = require("path");

const http = require("http");
const session = require("express-session");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const sessionMidWare = session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 5,
  },
});

const server = http.createServer(app);
const io = sketio(server);

app.use(sessionMidWare);
io.engine.use(sessionMidWare);

io.on("connection", (socket) => {
  console.log("User connected");

  const seSSion = socket.request.session;
  const seSSionId = seSSion.id;

  socket.join(seSSionId);

  io.to(seSSionId).emit("Message", {
    sender: "bot",
    message: "Welcome",
  });

  let progress = 0;

  socket.on("chat message", (message) => {
    io.to(seSSionId).emit("chat message", { sender: "user", message });

    switch (progress) {
      case 0:
        io.to(seSSionId).emit("chat message", {
          sender: "bot",
          message: `please input an option below: <br>
    1. Place Order <br>
    99. Checkout Order <br>
    98. Order History <br>
    97. Current Order <br>
    0. Cancel Order <br>`,
        });

        progress = 1;
        break;
      case 1:
        let response = "";
        if (message === "1") {
          response = "Option 1 selected <br> Please place an order";
        } else if (message === "99") {
          response = "Option 99 selected <br> checkout your order";
        } else if (message === "98") {
          response = "Option 98 selected <br> this is your order history";
        } else if (message === "0") {
          response = "Option 97 <br> this is your current order ";
        } else if (message === "0") {
          response = "Option 0 <br> order canceled";
        } else {
          response =
            "Incorrect option <br>1. Place Order <br> 99. Checkout Order <br> 98. Order History <br> 97. Current order <br> 0. Cancel Order <br>";
          progress = 1;
          io.to(seSSionId).emit("chat message", {
            sender: "bot",
            message: response,
          });
          return;
        }
        io.to(seSSionId).emit("chat message", {
          sender: "bot",
          message: response,
        });

        progress = 0;
        break;
    }
  });
});

server.listen(3300, () => {
  console.log("listening on PORT:3300");
});
