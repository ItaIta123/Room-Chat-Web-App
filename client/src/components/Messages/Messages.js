import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from '../Message/Message'
import "./Messages.css";

const Messages = ({ messagesArray, name }) => {
  console.log(messagesArray)
  return (
  <ScrollToBottom className="messages">
    {messagesArray.map((message, i) => (
      <div key={i}>
        <Message message={message} name={name} />
      </div>
    ))}
  </ScrollToBottom>
  )};

export default Messages;
