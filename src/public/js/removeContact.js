

function removeContact(){
    $(".user-remove-contact").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        let username = $(this).parent().find().find("div.user-name p").text();


        Swal.fire({
            title: `Are you sure want to remove ${username}?`,
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if(!result.value){
                return false;
            }
            $.ajax({
                url:"/contact/remove-contact",
                data:{uid:targetId},
                type:"delete",
                success:function(data){
                if(data.success){
                    // decreaseNumberNotification("noti_counter",1);
                    // $(".noti_content").find(`div[data-uid=${user.id}]`).remove();
                    // $("#ul.list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove(); 
                    decreaseNumberContact("count-contacts")
                    $("#contacts").find(`ul li[data-uid=${targetId}]`).remove();
    
                    socket.emit("remove-contact",{contactId:targetId})
                }
            }
        })
        })
 })
}

socket.on("response-remove-contact", function(user){
    decreaseNumberContact("count-contacts")
    $("#contacts").find(`ul li[data-uid=${user.id}]`).remove();

})

$(document).ready(function(){
removeContact();
})