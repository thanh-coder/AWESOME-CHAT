let userAvatar = null;
let userInfor = {};
let originAvatarSrc = null;
let originUserInfor = {};
let userUpdatePassword = {};
function updateUserInfo(){
    $('#input-change-avatar').bind("change",function(){
        let fileData = $(this).prop("files")[0];
        let math = ["image/png","image/jpg","image/jpeg"];
        let limit = 10485766;

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
       let username = $(this).val();
       let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$")
        if(!regexUsername.test(username)||username.length<3 || username.length>17){
            alertify.notify("username limit 3-17 word and without contain character special","error",7);
            $(this).val(originUserInfor.username)
            delete userInfor.username;
            return false;
        }
        userInfor.username = username;

    })
    $('#input-change-gender-male').bind("click",function(){
        let gender = $(this).val();
        if(gender !== "male"){
            alertify.notify("du lieu gioi tinh co van de","error",7);
            $(this).val(originUserInfor.gender)
            delete userInfor.gender;
            return false;
        }
        userInfor.gender = gender;
    })
    $('#input-change-gender-female').bind("click",function(){
        let gender = $(this).val();
        if(gender !== "female"){
            alertify.notify("du lieu gioi tinh co van de","error",7);
            $(this).val(originUserInfor.gender)
            delete userInfor.gender;
            return false;
        }
        userInfor.gender = gender;  
      })
    $('#input-change-address').bind("change",function(){
        let address = $(this).val();
        if(address.length < 3 || address.length > 30 ){
            alertify.notify("dia chi gioi han trong khoang 3-30 ki tu","error",7);
            $(this).val(originUserInfor.address)
            delete userInfor.address;
            return false;
        }
        userInfor.address = address;
    })
    $('#input-change-phone').bind("change",function(){
        let phone = $(this).val();
        let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/)
        if(!regexPhone.test(phone)){
            alertify.notify("so dien thoai bat dau boi so 0 va co 10-11 ki tu","error",7);
            $(this).val(originUserInfor.phone)
            delete userInfor.phone;
            return false;
        }
        userInfor.phone = phone;
    })
    $('#input-change-current-password').bind("change",function(){
        console.log($(this).val())
        let currentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
        if(!regexPassword.test(currentPassword)){
            alertify.notify("mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữu thường, chữ số và ki tự đặc biệt","error",7);
            $(this).val(null)
            delete userUpdatePassword.currentPassword;
            return false;
        }
        userUpdatePassword.currentPassword = currentPassword;
    })
    $('#input-change-new-password').bind("change",function(){
        console.log($(this).val())
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
        if(!regexPassword.test(newPassword)){
            alertify.notify("mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữu thường, chữ số và ki tự đặc biệt","error",7);
            $(this).val(null)
            delete userUpdatePassword.newPassword;
            return false;
        }
        userUpdatePassword.newPassword = newPassword;
    })
    $('#input-change-confirm-new-password').bind("change",function(){
        let confirmNewPassword = $(this).val();
        if(!userUpdatePassword.newPassword){
            alertify.notify("ban chua nhap mat khau moi","error",7);
            $(this).val(null)
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }
        if(confirmNewPassword != userUpdatePassword.newPassword){
            alertify.notify("nhap lai mat khau chua chinh xac","error",7);
            $(this).val(null)
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }
        userUpdatePassword.confirmNewPassword = confirmNewPassword;
    })
    
}

function callUpdateUserAvatar(){
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache:false,
        processData: false,
        contentType: false,
        data: userAvatar,
        success: function(result){
           $('.user-modal-alert-success').find('span').text(result.message)
           $('.user-modal-alert-success').css("display","block")
           $("#navbar-avatar").attr("src",result.imageSrc);
           originAvatarSrc = result.imageSrc;
           $("#input-btn-cancel-user").trigger("click");
   
        },
        error: function(error){
           $('.user-modal-alert-error').find('span').text(error.responseText)
           $('.user-modal-alert-error').css("display","block")
           $("#input-btn-cancel-user").trigger("click");
        }
    })
}
function callUpdateUserInfor(){
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfor,
        success: function(result){
           $('.user-modal-alert-success').find('span').text(result.message)
           $('.user-modal-alert-success').css("display","block")
           originUserInfor = Object.assign(originUserInfor,userInfor);
           $("#navbar-username").text(originUserInfor.username)
        //    $("#input-btn-cancel-user").trigger("click");

   
        },
        error: function(error){
            console.log(error)
           $('.user-modal-alert-error').find('span').text(error.responseText)
           $('.user-modal-alert-error').css("display","block")
           $("#input-btn-cancel-user").trigger("click");
        }
    })
}

function callLogout(){
    let timeInterval;
    Swal.fire({
        position: 'top-end',
        title: 'tu dong dang xuat sau 5s',
        html: 'thoi gian <strong> </strong>',
        showConfirmButton: false,
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timeInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
            },1000)
        },
        onClose : () => {
            clearInterval(timeInterval);
        }
      }).then(result => {
          $.get("/logout", function(){
              location.reload();
          })
      })
}

function callUpdateUserPassword(){
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function(result){
            console.log(result);
           $('.user-modal-pass-alert-success').find('span').text(result.message)
           $('.user-modal-pass-alert-success').css("display","block")
           $("#input-btn-cancel-password").trigger("click");
            callLogout();
        },
        error: function(error){
            console.log(error)
           $('.user-modal-pass-alert-error').find('span').text(error.responseText)
           $('.user-modal-pass-alert-error').css("display","block")
           $("#input-btn-cancel-password").trigger("click");
        }
    })
}


$(document).ready(function(){
 updateUserInfo();
 originAvatarSrc = $("#user-modal-avatar").attr("src");
 originUserInfor = {
    username: $('#input-change-username').val(),
    gender: $('#input-change-gender-male').is(":checked") ? $('#input-change-gender-male').val() : $('#input-change-gender-female').val(),
    address: $('#input-change-address').val(),
    phone: $('#input-change-phone').val()
}
console.log(originUserInfor)
 $("#input-btn-update-user").bind("click",function(){
     if(userInfor!=null || userInfor != undefined){
        if(Object.keys(userInfor).length < 1 && !userAvatar){
            alertify.notify("you have to change data before save","error",7);
            return false;
         }
     }
  if(userAvatar){
      callUpdateUserAvatar();
  }
  if(Object.keys(userInfor).length>0){
    callUpdateUserInfor();
  }

 })
 $("#input-btn-update-password").bind("click",function(){
    if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword){
        alertify.notify("you have to change full info","error",7);
        return false;
    }
    Swal.fire({
    title: 'Are you sure want to change password?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if(!result.value){
        $("#input-btn-cancel-password").click();
        return false;
    }
    callUpdateUserPassword();
})
})

$("#input-btn-cancel-password").bind("click",function(){
   userUpdatePassword = {};
   $("#input-change-confirm-new-password").val(null);
   $("#input-change-new-password").val(null);
   $("#input-change-current-password").val(null);

})

 $("#input-btn-cancel-user").bind("click",function(){
     userInfor = {};
     userAvatar = null;
     $('#input-change-username').val(originUserInfor.username);
     $('#input-change-address').val(originUserInfor.address);
     $('#input-change-phone').val(originUserInfor.phone);
     (originUserInfor.gender == "male") ? $('#input-change-gender-male').click() : $('#input-change-gender-female').click();

     $("#user-modal-avatar").attr("src",originAvatarSrc);
     $('#input-change-avatar').val(null);

 })

})