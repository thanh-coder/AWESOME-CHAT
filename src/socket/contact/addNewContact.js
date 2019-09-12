import {pushSocketIdToArray, emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";

let addNewContact = (io) => {
    let clients = {};
    io.on("connection",(socket)=>{
        clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);
        socket.on("add-new-contact",(data) => {
            let currentUser = {
                id: socket.request.user._id,
                username:socket.request.user.username!=undefined ? socket.request.user.username : socket.request.user.google.email,
                avatar: socket.request.user.avatar,
                address: socket.request.user.address != null ? socket.request.user.address : ""
            }
            if(clients[data.contactId]){
                emitNotifyToArray(clients,data.contactId,io, "response-add-new-contact", currentUser);
            }
        })
        socket.on("disconnect", () => {
            clients =  removeSocketIdFromArray(clients, socket.request.user._id,socket);
        })

    })
}

module.exports = addNewContact;
