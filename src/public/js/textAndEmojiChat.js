function textAndEmojiChat(divId){
    $(".emojionearea").unbind("keyup").on("keyup", function(element){
        emojioneEditor = $(this);
        if(element.which === 13){
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();
            if(!targetId.length || ! messageVal.length ){
                return false;
            }
            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal
            }
            if($(`#write-chat${divId}`).hasClass("chat-in-group")){
                dataTextEmojiForSend.isChatGroup = true;
            }
            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){
                let dataToEmit = {
                    message: data.message
                }
                let messageOfMe = $(`<div class="bubble me data-mess-id="${data.message._id}"></div>`)
                messageOfMe.text(data.message.text);
                let converEmojiMessage = emojione.toImage(messageOfMe.html());
               
                if(dataTextEmojiForSend.isChatGroup){
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.avatar}" >`;
                    messageOfMe.html(`${senderAvatar} ${converEmojiMessage}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                }else{
                messageOfMe.html(converEmojiMessage);
                dataToEmit.contactId = targetId;
                }
                 $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                 nineScrollRight(divId);

                $(`#write-chat-${divId}`).val("");
                emojioneEditor.find(".emojionearea-editor").text("");
              
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));
                $(`.person[data-chat=${divId}]`).on("manhhung.moveConversationToTheTop", function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("manhhung.moveConversationToTheTop");
                })
                $(`.person[data-chat=${divId}]`).trigger("manhhung.moveConversationToTheTop");
                socket.emit("chat-text-emoji", dataToEmit)
            }).fail(function(respone){
                alertify.notify(response.responseText, "error",7)
            })
        }
    })
}

    socket.on("response-chat-text-emoji", function(response){

        let divId = "";
        let messageOfYou = $(`<div class="bubble you data-mess-id="${response.message._id}"></div>`)
                messageOfYou.text(response.message.text);
                let converEmojiMessage = emojione.toImage(messageOfYou.html());
               
                if(response.CurrentGroupId){
                    let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.avatar}" >`;
                    messageOfYou.html(`${senderAvatar} ${converEmojiMessage}`);
                    divId = response.currentGroupId
                    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
                        increaseNumberMessageGroup(divId);                    
                    }
                }else{
                    messageOfYou.html(converEmojiMessage);
                    divId = response.currentUserId;
                } 

                if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
                    $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
                     nineScrollRight(divId);
                     $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
                }

                $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow())
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));
                $(`.person[data-chat=${divId}]`).on("manhhung.moveConversationToTheTop", function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("manhhung.moveConversationToTheTop");
                })
                $(`.person[data-chat=${divId}]`).trigger("manhhung.moveConversationToTheTop");
    })
