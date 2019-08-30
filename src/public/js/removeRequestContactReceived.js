function decreaseNumberContact(className){
    let currentValue = +$(`.${className}`).find('em').text();
    currentValue -= 1;
    if(currentValue == 0){
        $(`.${className}`).html("");
    } else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function removeRequestContactReceived(){
    $(".user-remove-request-contact-received").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url:"/contact/remove-request-contact-received",
            data:{uid:targetId},
            type:"delete",
            success:function(data){
            if(data.success){
                // decreaseNumberNotification("noti_counter",1);
                // $(".noti_content").find(`div[data-uid=${user.id}]`).remove();
                // $("#ul.list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove(); 
                decreaseNumberContact("count-request-contact-received")
                decreaseNumberNotification("noti_contact_counter",1);
                $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();

                socket.emit("remove-request-contact-received",{contactId:targetId})
            }
        }
    })
 })
}

socket.on("response-remove-request-contact-received", function(user){
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid=${user.id}]`).css("display","inline-block");
     $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();
    decreaseNumberContact("count-request-contact-sent");
    decreaseNumberNotification("noti_contact_counter",1);
})

$(document).ready(function(){
removeRequestContactReceived();
})