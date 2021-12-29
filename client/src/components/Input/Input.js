import React from "react";

import "./Input.css";

const Input = ({ message, setMessage, send_message }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type your message..."
      value={message}
      onChange={(e) => {
        setMessage(e.target.value);
      }}
      onKeyPress={(e) => (e.key === "Enter" ? send_message(e) : null)}
    ></input>
    <button
      className="sendButton"
      onClick={(e) => {
        send_message(e);
      }}
    >
      Send
    </button>
  </form>
);

export default Input;