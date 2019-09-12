function attachmentChat(divId){
    $(`#attachment-chat-${divId}`).unbind("change").on("change", function(){
        let fileData = $(this).prop("files")[0];
        let limit = 1048576;
        if(fileData.size > limit){
            alertify.notify("anh upload toi da cho phep la 1Mb","error",7);
            $(this).val(null);
            return false;
        }
        let isChatGroup = false;
        let targetId = $(this).data("chat");
        let messageFormData = new FormData();
        messageFormData.append("my-attachment-chat",fileData);
        messageFormData.append("uid",targetId);
        if($(this).hasClass("chat-in-group")){
            messageFormData.append("isChatGroup", true);
            isChatGroup = true;
        }
        $.ajax({
            url: "/message/add-new-attachment",
            type: "post",
            cache:false,
            processData: false,
            contentType: false,
            data: messageFormData,
            success: function(data){
                let dataToEmit = {
                    message: data.message
                }
                let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`)
                let attachmentChat = `<a href="data:${data.message.file.contentType};base64, ${bufferToBase64(data.message.file.data.data)}" 
                download="${ data.message.file.fileName }">
                    ${ data.message.file.fileName }
                </a>`;
                if(isChatGroup){
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.avatar}" >`;
                    messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                }else{
                messageOfMe.html(attachmentChat);
                dataToEmit.contactId = targetId;
                }
                 $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                 nineScrollRight(divId);

              
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
                $(`.person[data-chat=${divId}]`).find("span.preview").html("tep dinh kem...");
                $(`.person[data-chat=${divId}]`).on("manhhung.moveConversationToTheTop", function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("manhhung.moveConversationToTheTop");
                })
                $(`.person[data-chat=${divId}]`).trigger("manhhung.moveConversationToTheTop");
                socket.emit("chat-attachment", dataToEmit);
                let attachmentChatToAddModal = `
                <li>
                    <a href="data:${data.message.file.contentType};base64, ${bufferToBase64(data.message.file.data.data)}" 
                    download="${ data.message.file.fileName }">
                    ${ data.message.file.fileName }
                    </a>
                </li>
                `                
                $(`attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal)
            
            },
            error: function(error){
                alertify.notify(error.responseText,"error",7);
               
            }
        })
    })
}

$(document).ready(function(){
    socket.on("response-chat-attachment", function(response){
        let divId = "";
        let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
        let attachmentChat = `<a href="data:${response.message.file.contentType};base64, ${bufferToBase64(response.message.file.data.data)}" 
                download="${ response.message.file.fileName }">
                    ${ response.message.file.fileName }
                </a>`;
        if(response.currentGroupId){
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.avatar}" >`;
            messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
            divId = response.currentGroupId
            if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
                increaseNumberMessageGroup(divId);                    
            }
        }else{
            messageOfYou.html(attachmentChat);
            divId = response.currentUserId;
        } 

        if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
                nineScrollRight(divId);
                $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
        }

        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow())
        $(`.person[data-chat=${divId}]`).find("span.preview").html("tep dinh kem....");
        $(`.person[data-chat=${divId}]`).on("manhhung.moveConversationToTheTop", function(){
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("manhhung.moveConversationToTheTop");
        })
        $(`.person[data-chat=${divId}]`).trigger("manhhung.moveConversationToTheTop");
        if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
            let attachmentChatToAddModal = `
            <li>
                <a href="data:${response.message.file.contentType};base64, ${bufferToBase64(response.message.file.data.data)}" 
                download="${ response.message.file.fileName }">
                ${ response.message.file.fileName }
                </a>
            </li>
            `;
            $(`attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal)

        }
    })
})