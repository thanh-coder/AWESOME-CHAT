import UserModel from '../models/userModel';
import { tranSucces,transErrors } from '../lang/vi';
import bcrypt from 'bcrypt'

let saltRounds = 10;
let updateUser = (id,item) => {
    return UserModel.updateUser(id,item);
}

let updatePassword = (id,dataUpdate) => {
    return new Promise(async(resolve,reject) => {
        let currentUser = await UserModel.findUserById(id);
         if(!currentUser){
             reject(transErrors.account_undefined);
         }
         let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword)
         console.log(dataUpdate);
         if(!checkCurrentPassword){
            reject(transErrors.password_current_failed)
        }
        let salt = bcrypt.genSaltSync(saltRounds);
        await UserModel.updatePassword(id,bcrypt.hashSync(dataUpdate.newPassword,salt))
        resolve(tranSucces.update_password)
    })
}

module.exports = {
    updateUser,
    updatePassword
}