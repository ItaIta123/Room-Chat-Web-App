import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Join.css";

console.log("test join");

const Join = () => {
  let navigation = useNavigate();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const go_to_chat_page = (name, room) => {
    if (name && room) {
      navigation(`./chat?name=${name}&room=${room}`);
    } else {
      alert("Both Name and Room need to be full");
    }
  };

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput mt-20"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? go_to_chat_page(name,room) : null)}
          />
        </div>
        <Link
          onClick={(e) => (!name || !room ? e.preventDefault : null)}
          to={`./chat?name=${name}&room=${room}`}
        >
          <button className="button mt-20" type="submit">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
