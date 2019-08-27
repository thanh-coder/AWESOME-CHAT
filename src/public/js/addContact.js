function increaseNumberContact(className){
    let currentValue = +$(`.${className}`).find('em').text();
    currentValue += 1;
    if(currentValue == 0){
        $(`.${className}`).html("");
    } else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}
function addContact(){
    $(".user-add-new-contact").bind("click",function(){
        let targetId = $(this).data("uid");
        $.post("/contact/add-new",{uid:targetId},function(data){
            if(data.success){
                increaseNumberContact("count-request-contact-sent");
                $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css("display","inline-block");
                socket.emit("add-new-contact",{contactId:targetId})
            }
        })
    })
}

socket.on("response-add-new-contact", function(user){
    console.log(user.username)
    let notif =`
    <div data-uid="${ user.id }">
    <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
    <strong>${user.username}</strong> đã gửi lời mời kết bạn đến bạn!
    </div>
    `
    $(".noti_content").prepend(notif);
    $("#ul.list-notifications").prepend(`<li>${notif}</li>`);
    increaseNumberNotification("count-request-contact-received");
    increaseNumberNotification("noti_contact_counter");
    increaseNumberNotification("noti_counter");
})
