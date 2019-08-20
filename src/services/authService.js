import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import { transErrors, tranSucces } from '../lang/vi';
import UserModel from '../models/userModel';
let saltRounds = 7;


let register = async (email,gender,password) => {
    return new Promise(async (resolve,reject) => {
        let userModel = new UserModel();
        try{
        let userByEmail = await userModel.findByEmail(email);

        console.log("userByEmail:"+ userByEmail)
        if(userByEmail){
            if(userByEmail.deletedAt != null){
               return new reject(transErrors.account_removed)
            }
            if(!userByEmail.local.isActive){
                return reject(transErrors.account_not_active)
            }
            return reject(transErrors.account_in_use)
        }
        let salt = bcrypt.genSaltSync(saltRounds);
        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4()
            }
    
        }
        let user = await UserModel.create(userItem);
        console.log("item:"+user);
        resolve(tranSucces.userCreated(user.local.email));
    } 
    catch(err){
       console.log(err)
    }
    })
   
}
module.exports = {
  register:register
  
}