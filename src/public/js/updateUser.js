let userAvatar = null;
let userInfor = {};
let originAvatarSrc = null;
function updateUserInfo(){
    $('#input-change-avatar').bind("change",function(){
        let fileData = $(this).prop("files")[0];
        let math = ["image/png","image/jpg","image/jpeg"];
        let limit = 1048576;

        if($.inArray(fileData.type,math)===-1){
            alertify.notify("type file invalid","error",7);
            $(this).val(null);
            return false;
        }
        if(fileData.size > limit){
            alertify.notify("upload file too big","error",7);
            $(this).val(null);
            return false;
        }
        if(typeof (FileReader)!= "undefined"){
            let imagePreview = $('#image-edit-profile')
            console.log(imagePreview)
            imagePreview.empty();
            let fileReader = new FileReader();
            fileReader.onload = function(element){
                $("<img>",{
                    "src": element.target.result,
                    "class":"avatar img-circle",
                    "id":"user-modal-avatar",
                    "alt":"avatar"
                }).appendTo(imagePreview)
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);
            let formData = new FormData();
            formData.append("avatar",fileData);
            userAvatar = formData;
            console.log(fileReader);
        }else{
            alertify.notify("this browser do not support","error",7);
        }
    })
    $('#input-change-username').bind("change",function(){
       userInfor.username = $(this).val();
    })
    $('#input-change-gender-male').bind("click",function(){
        userInfor.gender = $(this).val();
    })
    $('#input-change-gender-female').bind("click",function(){
        userInfor.gender = $(this).val();
    })
    $('#input-change-address').bind("change",function(){
        userInfor.address = $(this).val();
    })
    $('#input-change-phone').bind("change",function(){
        userInfor.phone = $(this).val();
    })
}

$(document).ready(function(){
 updateUserInfo();
 originAvatarSrc = $("#user-modal-avatar").attr("src");
 console.log(userAvatar);
 $("#input-btn-update-user").bind("click",function(){
     console.log(Object.keys(userInfor));
     if(Object.keys(userInfor) < 1 && !userAvatar){
        alertify.notify("you have to change data before save","error",7);
        return false;
     }
 $.ajax({
     url: "/user/update-avatar",
     type: "put",
     cache:false,
     processData: false,
     contentType: false,
     data: userAvatar,
     success: function(){

     },
     error: function(){
         
     }
 })

 })
 $("#input-btn-cancel-user").bind("click",function(){
     userInfor = null;
     userAvatar = null;
     $("#user-modal-avatar").attr("src",originAvatarSrc);

 })

})