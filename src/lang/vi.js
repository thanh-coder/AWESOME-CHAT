export const transValidation ={
    email_incorrect: "email phải có dạng example@gmail.com",
    gender_incorrect: "chưa chonj giới tính",
    password_incorrect: "mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữu thường, chữ số và ksi tự đặc biệt",
    password_confirmation_incorrect: "nhập lại mật khẩu không chính xác"
}

export const transErrors = {
    account_in_use: "Email nay da duoc su dung",
    login_failed: "login that bai",
     server_err: "co loi phia server",
    account_removed: "tai khoan nay da bi xoa khoi he thong",
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
    logout_success:"dang xuat tai khoan thanh cong"
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