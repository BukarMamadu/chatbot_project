const socket = io();

const Form = document.getElementById("form");
const mesage = document.getElementById("message");

socket.on("chat message", (message) => {
  output(message);
});

Form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements["input"].value;

  socket.emit("chat message", message);

  e.target.elements["input"].value = "";
});

const output = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  if (message.sender === "bot") {
    div.innerHTML = `bot message: ${message.message}`;
  } else {
    div.innerHTML = `user message: ${message.message}`;
  }
  mesage.appendChild(div);
};
