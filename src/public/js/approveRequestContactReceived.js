
function approveRequestContactReceived(){
    $(".user-approve-request-contact-received").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
       
        $.ajax({
            url:"/contact/approve-request-contact-received",
            data:{uid:targetId},
            type:"put",
            success:function(data){
            if(data.success){
                let userInfo = $("#request-contact-received").find(`li[data-uid=${targetId}]`);
                $(userInfo).find(`div.user-approve-request-contact-received`).remove();
                $(userInfo).find(`div.user-remove-request-contact-received`).remove();
                $(userInfo).find("div.contactPanel")
                    .append(
                        `
                    <div class="user-talk" data-uid="${ targetId }">
                        Trò chuyện
                    </div>
                    <div class="user-remove-contact action-danger" data-uid="${ targetId }">
                        Xóa liên hệ
                    </div>
                        `
                    )
                    let userInfoHtml =userInfo.get(0).outerHTML;
                    $("#contacts").find("ul").prepend(userInfoHtml);
                    $(userInfo).remove();
                // decreaseNumberNotification("noti_counter",1);
                // $(".noti_content").find(`div[data-uid=${user.id}]`).remove();
                // $("#ul.list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove(); 
                decreaseNumberContact("count-request-contact-received")
                decreaseNumberNotification("noti_contact_counter",1);
                increaseNumberContact("count-contacts")
                $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();
                removeContact();

                socket.emit("approve-request-contact-received",{contactId:targetId})
            }
        }
    })
 })
}

socket.on("response-approve-request-contact-received", function(user){
    let notif =`
    <div data-uid="${ user.id }">
    <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
    <strong>${user.username}</strong> đã gửi lời mời kết bạn đến bạn!
    </div>
    `
    $(".noti_content").prepend(notif);
    $("#ul.list-notifications").prepend(`<li>${notif}</li>`);
    decreaseNumberContact("count-request-contact-sent");
    decreaseNumberNotification("noti_contact_counter",1);
    increaseNumberNotification("noti_counter",1);
    increaseNumberContact("count-contacts");
    $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();
    $("#find-user").find(`li[data-uid=${user.id}]`).remove();
    let userInfoHtml =`
    <li class="_contactList" data-uid="${ user.id }">
    <div class="contactPanel">
        <div class="user-avatar">
            <img src="images/users/${ user.avatar }" alt="">
        </div>
        <div class="user-name">
            <p>
                ${ user.username }
            </p>
        </div>
        <br>
        <div class="user-address">
            <span>&nbsp ${ user.address }.</span>
        </div>
        <div class="user-talk" data-uid="${ user._id }">
            Trò chuyện
        </div>
        <div class="user-remove-contact action-danger" data-uid="${ user._id }">
            Xóa liên hệ
        </div>
    </div>
</li>
    `
    $("#contacts").find("ul").prepend(userInfoHtml);
})

$(document).ready(function(){
approveRequestContactReceived();
})