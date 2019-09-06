function typingOn(){
    let targetId = $(`#write-chat-${divId}`).data("chat");
    if($(`#write-chat${divId}`).hasClass("chat-in-group")){
        socket.emit("user-is-typing",{groupId:targetId})
    } else {
        socket.emit("user-is-typing",{contactId:targetId})
    }    
}

$(document).ready(function(){
    socket.on("response-user-is-typing",function(response){
        let messageTyping = `<div class="bubble you bubble-typing-gif" 
            <img src="images/chat/typing.gif" />
            </div>
        `
        if(response.CurrentGroupId){
            if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
                $(`.chat[data-chat=${response.currentUserId}`).append(messageTyping);
                nineScrollRight(response.CurrentGroupId);
            } else {
                $(`.chat[data-chat=${response.currentUserId}`).append(messageTyping);
                nineScrollRight(response.currentUserId);
            }
        }
    })
})