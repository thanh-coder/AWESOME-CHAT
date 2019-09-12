import {pushSocketIdToArray, emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";
import { O_NONBLOCK } from "constants";

let userOnlineOffline = (io) => {
    let clients = {};
    io.on("connection",(socket)=>{
        clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients,group._id,socket.id);
        }) 

        //step1: emit to user after login or f5 web page
        let listUserOnline = Object.keys(clients);
        socket.emit("server-send-list-users-online",listUserOnline);
        //step 02: emit to all other users when has new user oline
        socket.broadcast.emit("server-send-when-new-user-online",socket.request.user._id)
        socket.on("disconnect", () => {
            clients =  removeSocketIdFromArray(clients,socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
            clients =  removeSocketIdFromArray(clients, group._id, socket);

            })
            //step 3 emit to all other users when has new user offline
        socket.broadcast.emit("server-send-when-new-user-offline",socket.request.user._id)

        })

    })
}

module.exports = userOnlineOffline;
