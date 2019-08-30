function callFindUsers(event){
    console.log(event.target)
    let keyword = $("#input-find-users-contact").val();
    console.log("keyword"+keyword)
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!regexKeyword.test(keyword)){
            alertify.notify("loi tu khoa tim kiem chi cho phep chu so ki tu va so cho phep khoang trong","error",7);
            return false;
    }
    $.get(`/contact/find-users/${keyword}`,function(data){
        console.log(data)
        $("#find-user ul").html(data);
        addContact();
        removeRequestContactSent();
    })

}
$(document).ready(function(){
    $("#btn-find-users-contact").bind("click",callFindUsers);
    // $("#input-find-users-contact").bind("keypress",callFindUsers);
})