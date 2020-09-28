import React, { useState } from "react";
import "./App.css";
import User from "./User";
import Message from "./Message";
import Room from "./Room";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Redirect } from "react-router";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import usc from "./image/usc.png";
export const history = createBrowserHistory();

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [nameId, setName] = useState("");
  const [roomJoin, setRoomJoin] = useState("");
  const [URL, setURL] = useState("");
  const [participate, setParticipate] = useState(false);
  const [messageURL, setMessageURL] = useState("");

  const userName = (name) => {
    setName(name);
    let direct = "/room/username=" + name;
    setURL(direct);
  };
  const login = (status) => {
    setisLoggedIn(status);
  };
  const roomIn = (room, name) => {
    setRoomJoin(room);
    let message = "/message/?username=" + name + "&room=" + room;
    setMessageURL(message);
  };
  const participateInRoom = (participate) => {
    if (participate) {
      setParticipate(true);
    }
    setisLoggedIn(true);
  };

  return (
    <Router history={history}>
      <div className="chat-frame">
        <label className="title">
          ChatApp
          <span>
            <WhatsAppIcon></WhatsAppIcon>
          </span>
        </label>
        <Route exact path="/">
          <img src={usc} alt="USC" className="usc"></img>
          <User userName={userName} login={login}></User>
        </Route>
        <Route path="/room">
          <Room
            loginName={nameId}
            checkLogin={isLoggedIn}
            roomIn={roomIn}
            participateInRoom={participateInRoom}
          ></Room>
        </Route>
        <Route path="/message">
          <Message
            name={nameId}
            room={roomJoin}
            checkLogin={isLoggedIn}
          ></Message>
        </Route>
        {isLoggedIn && !participate ? <Redirect to={URL}></Redirect> : null}
        {isLoggedIn && participate ? (
          <Redirect to={messageURL}></Redirect>
        ) : null}
      </div>
    </Router>
  );
}

export default App;
