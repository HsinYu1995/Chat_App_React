import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import { history } from "./App";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const ENDPOINT = "http://localhost:5002/";
let socket;

const Message = ({ name, room, checkLogin }) => {
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState("");
  const [user, setUsers] = useState([]);
  const url = window.location.href;
  const urlObj = new URL(url);
  const param = new URLSearchParams(urlObj.search.substring(1));

  if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    checkLogin = true;
  }
  if (!checkLogin) {
    history.push("/");
    window.location.reload(false);
  }
  window.addEventListener("beforeunload", (e) => {
    var confirmationMessage = "o/";
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  });

  if (name === "" || name === undefined) {
    name = param.get("username");
  }
  if (room === "" || room === undefined) {
    room = param.get("room");
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connect", () => {
      socket.send("hello!");
    });
    socket.emit("join", { name, room }, () => {
      return () => {
        console.log("disconnect in return join!");
        socket.emit("disconnect");
        socket.off();
      };
    });
    socket.on("number", (people) => {
      setUsers(people);
    });
    socket.emit("checkUser", name);
  }, [name, room]);

  useEffect(() => {
    socket.on("message", (getMessage) => {
      setMessages([...messages, getMessage]);
    });
    return () => {
      socket.off("message");
    };
  }, [messages]);

  useEffect(() => {
    socket.on("number", (people) => {
      setUsers(people);
    });
  }, []);

  const toServer = (e) => {
    e.preventDefault();
    if (sendMessage) {
      socket.emit("sendMessage", sendMessage, () => setSendMessage(""));
    }
  };
  const leave = () => {
    socket.emit("disconnect", name);
    socket.off();

    history.push("/room/username=" + name);
    window.location.reload(true);
  };
  const onChange = (e) => {
    e.preventDefault();
    setSendMessage(e.target.value);
  };
  const chat = (user) => {
    if (user === name) {
      return "own";
    } else {
      return "other";
    }
  };
  const chatUser = (user) => {
    if (user === name) {
      return "userOwn";
    } else {
      return "userOther";
    }
  };
  const userItself = (input) => {
    if (input === name) {
      return "list-group-item active";
    }
    return "list-group-item";
  };

  return (
    // array should assign a specific id

    <div className="messageDiv">
      <label>Current Room: {room === "" ? param.get("room") : room}</label>
      <div className="row">
        <div className="col-sm-2 col-2" id="listFrame">
          UserList:
          <ul className="userList list-group" id="userListOutfit">
            {user.map((user, index) => (
              <li className={userItself(user)} key={index}>
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-sm-9 col-9" id="messageHolder">
          {messages.map((words, index) => (
            <div key={index}>
              <div className={chat(words.user)}>{words.text}</div>
              <p className={chatUser(words.user)}>{words.user}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="row h-25">
        <div className="col-sm-1 col-1"></div>
        <div className="col-sm-8 col-4" id="sendMessagePart">
          <div className="row" id="messageDiv">
            <input
              type="text"
              placeholder="Send Message here"
              onChange={onChange}
              className="inputMessage"
              value={sendMessage}
            ></input>
          </div>
        </div>
        <div className="col-sm-3 col-3" id="messageAndButton">
          <div className="col-sm-1"></div>
          <div className="col">
            <div className="row" id="sendDiv">
              <Button
                onClick={toServer}
                variant="contained"
                color="primary"
                endIcon={<SendIcon></SendIcon>}
              >
                Send
              </Button>
            </div>
            <div className="row">
              <Button
                onClick={leave}
                variant="contained"
                color="secondary"
                endIcon={<ExitToAppIcon></ExitToAppIcon>}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Message;
