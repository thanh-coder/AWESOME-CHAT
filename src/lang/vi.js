export const transValidation ={
    email_incorrect: "email phải có dạng example@gmail.com",
    gender_incorrect: "chưa chonj giới tính",
    password_incorrect: "mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữu thường, chữ số và ksi tự đặc biệt",
    password_confirmation_incorrect: "nhập lại mật khẩu không chính xác"
}

export const transErrors = {
    account_in_use: "Email nay da duoc su dung",
    account_removed: "tai khoan nay da bi xoa khoi he thong",
    account_not_active: "Email nay chua duoc active, vui long ken tr email de active"
};

export const tranSucces = {
    userCreated: (userEmail) => {
        return `Tai khoan <strong>${userEmail}</strong> da duoc tao, vui long kiem tra Email cua ban de active tai khoan`
    }
}