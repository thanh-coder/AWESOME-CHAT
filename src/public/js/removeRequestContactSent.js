function decreaseNumberContact(className){
    let currentValue = +$(`.${className}`).find('em').text();
    currentValue -= 1;
    if(currentValue == 0){
        $(`.${className}`).html("");
    } else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function removeRequestContactSent(){
    $(".user-remove-request-contact-sent").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url:"/contact/remove-request-contact",
            data:{uid:targetId},
            type:"delete",
            success:function(data){
            if(data.success){
                decreaseNumberContact("count-request-contact-sent")
                $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).hide();
                $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css("display","inline-block");
                socket.emit("remove-request-contact-sent",{contactId:targetId})
                $("#request-contact-sent").find(`li[data-uid=${targetId}]`).remove();
            }
        }
    })
 })
}

socket.on("response-remove-request-contact-sent", function(user){
    
    $(".noti_content").find(`div[data-uid=${user.id}]`).remove();
    $("#ul.list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove();
     $("#request-contact-received").find(`li[data-uid=${user.id}]`).remove();
    decreaseNumberNotification("count-request-contact-received");
    decreaseNumberNotification("noti_contact_counter");
    decreaseNumberNotification("noti_counter");
})

$(document).ready(function(){
    removeRequestContactSent();
})