import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { history } from './App';


const registerServer = 'https://chat-app-server-joe.herokuapp.com/register/';
// const registerServer = 'http://localhost:5002/register/';
const Register = ({login, userName}) => {
    const [registerUsername, setUsername] = useState('');
    const [registerPassWord, setPassword] = useState('');
    const [registerEmail, setEmail] = useState('');
    
    
    const onSubmit = (e)  => {
        e.preventDefault();
        console.log(registerUsername);
        console.log(registerPassWord);
        console.log(registerEmail);
        axios.post(registerServer, {userName: registerUsername, password:registerPassWord, email:registerEmail
        })
        .then(res => {
            console.log("res: ");
            console.log(res.data);
            if (res.data['register'] === 'success') {
                alert("Register successfully, you will be logged in!");
                login(true);
                userName(registerUsername);
            }    
        }, error => {
            alert('Registration fail! The User Name or Email has already been taken!');
            console.log(error);
            login(false);
        });
        
    }
    const back = (e) => {
        e.preventDefault();
        history.push('/');
        window.location.reload(false);
        
    }

 
    
    
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="form-row">
                    <div className="form-group col-sm-4 col-4"></div>
                    <div className="form-group col-sm-2 col-2">
                    <label className="registerLabel">UserName<span className="star">{'\u273D'}</span>: </label>
                    </div>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} required></input>
                </div>
                <div className="form-row">
                    <div className="form-group col-sm-4 col-4"></div>
                    <div className="form-group col-sm-2 col-2">
                    <label className="registerLabel">password<span className="star">{'\u273D'}</span>: </label>
                    </div>
                    <input type="text" onChange={(e) => setPassword(e.target.value)} required></input>
                </div>
                <div className="form-row">
                    <div className="form-group col-sm-4 col-4"></div>
                    <div className="form-group col-sm-2 col-2">
                    <label className="registerLabel" >Email<span className="star">{'\u273D'}</span>: </label>
                    </div>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} required></input>
                </div>
                <input type='submit' value='Register' className='registerButton'></input>
            </form>
            <Button variant="contained" color="secondary" onClick={back} className="backButton">BACK</Button>   
        </div>

    )

}
export default Register;