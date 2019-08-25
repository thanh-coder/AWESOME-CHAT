import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import { transErrors, tranSucces, transMail } from '../lang/vi';
import UserModel from '../models/userModel';
import sendEmail from "../config/mailer"
let saltRounds = 7;


let register = async (email,gender,password,protocol,host) => {
    return new Promise(async (resolve,reject) => {
        let userModel = new UserModel();
        try{
        let userByEmail = await UserModel.findByEmail(email);
        // let userByEmail = await UserModel.findOne({"local.email":email})
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
        let user = await UserModel.createNew(userItem);
        resolve(tranSucces.userCreated(user.local.email));

        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`
        // sendEmail(email,transMail.subject,transMail.template(linkVerify))
        //     .then(success =>{
        //         console.log(success)
        //         resolve(tranSucces.userCreated(user.local.email));
        //     })
        //     .catch(async err => {
        //         if(await UserModel.find({_id:user._id})){
        //             // await UserModel.removeById(user._id)
        //             await UserModel.findByIdAndRemove(user._id,{useFindAndModify: false}).exec();
        //         }
        //         console.log("loi:"+err);
        //         reject(transMail.send_failed);
        //     })
    } 
    catch(err){
       console.log(err)
    }
    })
   
}

let verifyAccount = (token) => {
    return new Promise(async (resolve,reject) => {
       await UserModel.verifyToken(token)      
        resolve(tranSucces.account_actived)
    })
}
module.exports = {
  register:register,
  verifyAccount
  
}