import React, { useState } from "react";
import "./App.css";
import Register from "./Register";
import axios from "axios";
import Button from "@material-ui/core/Button";

const loginServer = "http://localhost:5002/login/";

const User = ({ userName, login }) => {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [register, setRegister] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    axios.post(loginServer, { userName: name, password: password }).then(
      (res) => {
        if (res.data["login"] === "success") {
          alert("Log in successfully!");
          login(true);
          userName(name);
        }
        if (res.data["login"] === "repeated") {
          alert("This user name has already been logged in!");
          login(false);
        }
      },
      (error) => {
        alert("Invalid User Name or password!");
        login(false);
        console.log(error);
      }
    );
  };
  const registerUser = () => {
    setRegister(true);
  };

  return (
    <div>
      {register ? (
        <Register login={login} userName={userName}></Register>
      ) : (
        <form>
          <div className="form-group row">
            <div className="col-sm-3 col-"></div>
            <div className="col-sm-8 col-8">
              <div className="row">
                <div className="col-sm-2 col-2">
                  <label>UserName: </label>
                </div>
                <div className="col-sm-1 col-1"></div>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-3 col-3"></div>
            <div className="col-sm-8 col-8">
              <div className="row">
                <div className="col-sm-2 col-2">
                  <label>Password: </label>
                </div>
                <div className="col-sm-1 col-1"></div>
                <input
                  type="text"
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-8 col-12">
              <Button
                onClick={onSubmit}
                className="loginButton"
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </div>
            <div className="col-sm-2 col-12">
              <Button
                onClick={registerUser}
                className="loginButton"
                variant="contained"
                color="primary"
              >
                Register
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default User;
