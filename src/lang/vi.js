export const transValidation ={
    email_incorrect: "email phải có dạng example@gmail.com",
    gender_incorrect: "chưa chonj giới tính",
    password_incorrect: "mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữu thường, chữ số và ksi tự đặc biệt",
    password_confirmation_incorrect: "nhập lại mật khẩu không chính xác",
    update_user:"username gioi han 3-17 ki tu va khong chua ki tu dac biet",
    update_gender:"du lieu gioi tinh co van de",
    update_adress:"dia chi gioi han trong khoang 3-30 ki tu",
    update_phone:"so dien thoai bat dau boi so 0 va co 10-11 ki tu",
    message_text_emoji_incorrect:"tin nhan khong hop le.dam bao toi thieu 1 ki tu",
    keyword_find_user:"keyword tim kiem khong hop le"
}

export const transErrors = {
    account_in_use: "Email nay da duoc su dung",
    login_failed: "login that bai",
    server_err: "co loi phia server",
    avatar_type:"file type khong hop le",
    account_undefined:"tai khoan khong ton tai",
    avatar_size:"image allow upload acceed is 1mb",
    image_message_size:"image allow upload acceed is 1mb",
    attachment_message_size:"image allow upload acceed is 1mb",
    account_removed: "tai khoan nay da bi xoa khoi he thong",
    password_current_failed:"mat khau hien tai khong ching xac",
    conversation_not_found:"cuoc tro chuyen khong ton tai",
   
    account_not_active: "Email nay chua duoc active, vui long ken tr email de active"
};

export const tranSucces = {
    userCreated: (userEmail) => {
        return `Tai khoan <strong>${userEmail}</strong> da duoc tao, vui long kiem tra Email cua ban de active tai khoan`
    },
    account_actived:"xac thuc tai khoan thanh cong ban da co the dang nhap vao ung dung",
    loginSuccess: (username) => {
        return `xin chao ${username} chuc ban mot ngay tot lanh`
    },
    logout_success:"dang xuat tai khoan thanh cong",
    avatar_updated:"update avatar success, yeah",
    user_update: "update info user success",
    update_password:"cap nhat mat khau thanh cong"
}

export const transMail = {
    subject: "Awesome chat: xac nhan kich hoat tai khoann",
    template: (linkVerify) => {
        return `
        <h2> ban nhan duoc email nay vi da dang ki tai khoan tren ung ung</h2>
        <h3>vui long click vao lien ket ben duoi</h3>
        <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
        <h4> neu tin rang email nay la nham lan
        `
    },
    send_failed: "có lỗi vui lòng liên hệ lại với chúng tôi",
}