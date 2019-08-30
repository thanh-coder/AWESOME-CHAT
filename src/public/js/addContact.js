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
                $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).css("display","inline-block");
                socket.emit("add-new-contact",{contactId:targetId})
                let userInFoHtml = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML;
                console.log(userInFoHtml);
                $("#request-contact-sent").find("ul").prepend(userInFoHtml); 
                removeRequestContactSent();

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
    increaseNumberNotification("count-request-contact-received",1);
    increaseNumberNotification("noti_contact_counter",1);
    increaseNumberNotification("noti_counter",1);
    let userInFoHtml = `
    <li class="_contactList" data-uid="${user.id}">
    <div class="contactPanel">
        <div class="user-avatar">
            <img src="images/users/${user.avatar}" alt="">
        </div>
        <div class="user-name">
            <p>
                ${user.username}
            </p>
        </div>
        <br>
        <div class="user-address">
            <span>&nbsp ${user.address}</span>
        </div>
        <div class="user-acccept-contact-received" data-uid="${user.id}">
            Chấp nhận
        </div>
        <div class="user-reject-request-contact-received action-danger" data-uid="${user.id}">
            Xóa yêu cầu
        </div>
    </div>
</li>
    `
$("#request-contact-received").find("ul").prepend(userInFoHtml);
})
