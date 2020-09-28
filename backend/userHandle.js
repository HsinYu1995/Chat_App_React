var userArray = [];
var roomDict= {};


const addUser = ({name, room}) => {
    if (room !== '' && roomDict[room] !== undefined) {
        roomDict[room].push(name);
    } else if (room !== '') {
        let roomName = [name];
        roomDict[room] = roomName;
    } 
    return roomDict;
     
}

const deleteUser = (name, room) => {
    if (roomDict[room] !== undefined) {
        let index = roomDict[room].indexOf(name);
        roomDict[room].splice(index, 1);
        if (roomDict[room].length == 0) {
            delete roomDict[room];           
        }
    }
    return roomDict;
    
    
}


const getRoomArray = () => {
    var roomArray = [];
    Object.keys(roomDict).map((key) => {
        roomArray.push(key);
    })
    return roomArray;
}

const getRoomDict = () => {
    return roomDict;
}
const checkRepeatedLogin = (name) => {
    if (userArray.includes(name)) {
        return true;
    }
    userArray.push(name);  
    return false;

}
const logout = (name) =>　{
    if (userArray.includes(name)) {
        let index = userArray.indexOf(name);
        userArray.splice(index, 1);
        return true;
    }
    return false;
}
const addUserArray = (name) => {
    if (!userArray.includes(name)) {
        userArray.push(name);
    }
    return true;

}
const deleteUserArray = (name) => {
    if (userArray.includes(name)) {
        let index = userArray.indexOf(name);
        userArray.splice(index, 1);
    }
    return true;
}

module.exports = {addUser, deleteUser, getRoomArray, getRoomDict, checkRepeatedLogin, logout, addUserArray, deleteUserArray};

