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
                let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`)
                if(dataTextEmojiForSend.isChatGroup){
                    messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.avatar}" >`)
                    messageOfMe.text(data.message.text);
                    increaseNumberMessageGroup(divId)
                }else{
                    messageOfMe.text(data.message.text);

                }
                let converEmojiMessage = emojione.toImage(messageOfMe.html());
                console.log(converEmojiMessage)
                messageOfMe.html(converEmojiMessage);
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);
              
                $(`#write-chat-${divId}`).val("");
                emojioneEditor.find(".emojionearea-editor").text("");
              
                $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));
                $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("click.moveConversationToTheTop");
                })
                $(`.person[data-chat=${divId}]`).click();

            }).fail(function(respone){
                alertify.notify(response.responseText, "error",7)
            })
        }
    })
}