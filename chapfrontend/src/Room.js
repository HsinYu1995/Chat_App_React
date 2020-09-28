import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { history } from "./App";
import io from "socket.io-client";
import CreateIcon from "@material-ui/icons/Create";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { createBrowserHistory } from "history";
import { usePath } from "hookrouter";
import queryString from "query-string";
import axios from "axios";
const ENDPOINT = "http://localhost:5002/";
const LOGOUT = "http://localhost:5002/logout/";

let socket;
export const roomHistory = createBrowserHistory();
const Room = ({ loginName, checkLogin, roomIn, participateInRoom }) => {
  const [roomInput, setRoomInput] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [rooms, setRoomArray] = useState([]);
  const [pressCreate, setPressCreate] = useState(false);
  let url = usePath();
  let userName = queryString.parse(url);
  if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    checkLogin = true;
  }
  if (!checkLogin) {
    history.push("/");
    window.location.reload(false);
  }
  if (loginName === undefined || loginName === "") {
    loginName = userName["/room/username"];
  }
  socket = io(ENDPOINT);
  useEffect(() => {
    socket.on("connect", () => {
      socket.send("hello!");
    });
    socket.on("roomArray", (roomArray) => {
      setRoomArray(roomArray);
    });
    socket.emit("checkUser", loginName);
  }, [loginName]);

  const createRoom = (e) => {
    e.preventDefault();
    setRoomInput(true);
    setPressCreate(true);
  };
  const connectRoom = (e) => {
    e.preventDefault();

    if (rooms.includes(roomName)) {
      alert("The room has already been taken!");
      return;
    }
    join(roomName);
  };
  const join = (room) => {
    roomIn(room, loginName);
    participateInRoom(true);
    setRoomInput(false);
    setPressCreate(true);
  };
  const logout = (e) => {
    axios.post(LOGOUT, { name: loginName }).then(
      (res) => {
        alert("Log out Succeesfully!");
      },
      (error) => {
        console.log(error);
      }
    );

    e.preventDefault();
    history.push("/");
    window.location.reload(false);
  };
  return (
    <div>
      <Router history={roomHistory}>
        <div>
          <ul className="roomList">
            {rooms.map((room) => (
              <li key={room} className="roomLi">
                {room}
                <Button
                  onClick={(e) => join(room)}
                  variant="contained"
                  color="primary"
                >
                  Join
                </Button>
              </li>
            ))}
          </ul>
          {pressCreate ? null : (
            <Button
              onClick={createRoom}
              className="createNewRoom"
              variant="contained"
              color="primary"
              endIcon={<CreateIcon></CreateIcon>}
            >
              Create
            </Button>
          )}
        </div>

        {roomInput ? (
          <div>
            <label>Room Name: </label>
            <input
              type="text"
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
            ></input>
            <Button
              onClick={connectRoom}
              variant="contained"
              color="primary"
              endIcon={<AddIcon></AddIcon>}
            >
              Add
            </Button>
          </div>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          onClick={logout}
          className="logout"
        >
          Log out
        </Button>
      </Router>
    </div>
  );
};
export default Room;
