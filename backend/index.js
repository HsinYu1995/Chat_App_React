const { addUser, deleteUser, getRoomArray, checkRepeatedLogin, logout, addUserArray, deleteUserArray} = require('./userHandle.js');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const router = require('./router');  // router.js
const PORT = process.env.PORT || 5002;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Login = require('./login');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

// ACCESS THE .env file
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

mongoose.connect(
    process.env.MONGO_DB, {newUser: true}, () => {
        console.log('Connected to DB!');
    }
)
app.post('/register', async (req, res) => {
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // need to awiat for bcrypt to hash
    const user = new Login({
        userName: req.body.userName,
        password: hashedPassword,
        email: req.body.email
    });
    user.save()
    .then(data => {
        console.log(data);
        var transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.AUTH_USER,
              pass: process.env.AUTH_PASSWORD
            }
        });

        const message = {
            from:'ChatApp@',
            to: req.body.email,
            subject: 'Registration ChatApp',
            text: 'You have successfully register for ChatApp!'
        };
        if (req.body.email !== '') {
            transport.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            });
        };
        
        return res.status(201).json({register:'success'});
    })
    .catch(err => {
        console.log(err);
        return res.status(403).json({register: 'fail'});
    });
})
app.post('/logout', async(req,res) => {
    let name = req.body.name;
    let logoutSuccess = logout(name);
    if (logoutSuccess) {
        return res.status(200).json({logout: 'success'});
    }
    return res.status(401).json({logout: 'fail'});
      
})
app.post('/login', async (req, res) => {
    try {
        const user = (await Login.find({userName: req.body.userName}).exec());
        if (user.length == 0) {
            return res.status(401).json({login: 'fail'});
        } else {
            const hashedPassword = user[0].password;
            const status = await bcrypt.compare(req.body.password, hashedPassword);
            if (status) {
                let alreadyLogin = checkRepeatedLogin(req.body.userName);
                if (alreadyLogin) {
                    return res.status(200).json({login: 'repeated'});
                }
                return res.status(200).json({login: 'success'});
            }
            return res.status(401).json({login: 'fail'});    
        }  

    } catch (err) {
        return res.json({message: err});
    }
});

io.on('connect', (socket) => {
    let thisRoom;
    let thisName;
    let roomArray = getRoomArray();

    socket.on('checkUser', (name) => {
        addUserArray(name);
        thisName = name; // important!!!!!!!
    })
    console.log("We have a connection");

    // the room and name here have already checked for valididation
    socket.on('join', ({name, room}, callback) => {
        thisName = name;
        thisRoom = room;
        roomDict = addUser({name, room});
        let peopleInRoom = roomDict[room];
        
        socket.emit('message', {user: 'admin', text: "Welcome " + name + "!"});
        // tell other people that a person joins in!
        socket.broadcast.to(room).emit('message', {user: 'admin', text: name + " has joined in the room!"});
        socket.join(room);
        if (peopleInRoom !== null && peopleInRoom !== undefined) {
            io.in(room).emit('number', peopleInRoom);
        }
        callback();

    })
    socket.on('sendMessage', (message, callback) => {
        // socket.to would exclude the sender! server.to would contain all the people in the same room
        io.to(thisRoom).emit('message', {user: thisName,text:message});
        callback();
    })
    socket.on('disconnect', () => {
        let deleteRoomDict = deleteUser(thisName, thisRoom);       
        let peopleInRoom = deleteRoomDict[thisRoom];
        socket.to(thisRoom).emit('message', {user: 'admin', text: thisName + ' has left the room!'});
        if (peopleInRoom !== null && peopleInRoom !== undefined) {
            io.in(thisRoom).emit('number', peopleInRoom);
        }
        deleteUserArray(thisName);
        console.log("Disconnected!");
        
        
    })
    socket.emit('roomArray', roomArray);
    
})
app.use(router);
server.listen(PORT, () => console.log('Server has started on Port ' + PORT));
