import {pushSocketIdToArray, emitNotifyToArray,removeSocketIdFromArray} from "../../helpers/socketHelper";

let removeRequestContactReceived= (io) => {
    let clients = {};
    io.on("connection",(socket)=>{
        clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);
        socket.on("remove-request-contact-received",(data) => {
            let currentUser = {
                id: socket.request.user._id,
               
            }
            if(clients[data.contactId]){
                emitNotifyToArray(clients,data.contactId,io, "response-remove-request-contact-received", currentUser);
            }
        })
        socket.on("disconnect", () => {
            clients =  removeSocketIdFromArray(clients, socket.request.user._id,socket);
        })

    })
}

module.exports = removeRequestContactReceived;

{/* <hr>
<div class="read-more-all-chat">
<a href="javascript:void(0)" id="link-read-more-all-chat" > 
        <strong>xem them....</strong>
</a>
<div class="read-more-all-chat-loader"><div></div><div></div></div>
</div>
</hr>


<hr>
    <div class="read-more-user-chat">
        <a href="javascript:void(0)" id="link-read-more-user-chat" > 
                <strong>xem them.....</strong>
        </a>
        <div class="read-more-user-chat-loader"><div></div><div></div></div>
    </div>
</hr>

<hr>
    <div class="read-more-group-chat">
        <a href="javascript:void(0)" id="link-read-more-group-chat" > 
                <strong>xem them....</strong>
        </a>
        <div class="read-more-group-chat-loader"><div></div><div></div></div>
    </div>
</hr> */}