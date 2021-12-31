import React, { useState, useEffect } from "react";
// import queryString from "query-string"; // for retrieving data from url
import {io} from "socket.io-client";
import { useLocation } from "react-router-dom";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from '../TextContainer/TextContainer';


import "./Chat.css";

// console.log("test chat");
let socket;

// helper function to get url parameters
const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const Chat = (location) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState("");
  const [messagesArray, setMessagesArray] = useState([]);

  const ENDPOINT = "https://react-chat-web-app-itamar.herokuapp.com/";
  let query = useQuery();

  // sending message function
  const send_message = (event) => {
    // console.log("send message function fired")
    // prevent default so page will not get reload when user clicks the button
    event.preventDefault();

    // send only if message is populated
    if (message) {
      // console.log("we have a message in the front end")
      socket.emit("user message", message, () => setMessage(""));
    }
  };

  // getting data from url and emit 'disconnect' on component dismount
  useEffect(() => {
    const name = query.get("name");
    const room = query.get("room");

    setName(name);
    setRoom(room);

    // firing up socket
    socket = io(ENDPOINT);

    // emitting join event
    socket.emit("join", { name, room }, () => {});
    // console.log(`Emmited join with name  ${name} and room ${room}`)
    // on dismounting of the Chat component (user leaves the page)
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, query]);

  // listen to 'message' event from backend
  useEffect(() => {
    // console.log("second useEffect")
    socket.on("message", (message) => {
      // console.log("detected message event inside front end")
      setMessagesArray([...messagesArray, message]);
      // console.log(message, messagesArray);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messagesArray]);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messagesArray={messagesArray} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          send_message={send_message}
        />
      </div>
      <TextContainer users={users} userName={name}/>
    </div>
  );
};

export default Chat;
