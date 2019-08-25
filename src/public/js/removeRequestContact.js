function decreaseNumberContact(className){
    let currentValue = +$(`.${className}`).find('em').text();
    currentValue -= 1;
    if(currentValue == 0){
        $(`.${className}`).html("");
    } else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function removeRequestContact(){
    $(".user-remove-request-contact").bind("click",function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url:"/contact/remove-request-contact",
            data:{uid:targetId},
            type:"delete",
            success:function(data){
            if(data.success){
                decreaseNumberContact("count-request-contact-sent")
                $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide();
                $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css("display","inline-block");
            }
        }
    })
 })
}

