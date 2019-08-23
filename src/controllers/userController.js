import multer from "multer";
import {app} from "../config/app";
import uuidv4 from "uuid/v4"
import { tranSucces,transErrors } from "../lang/vi";
import fsExtra from "fs-extra";
import { user } from "../services/index";
let storageAvatar = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,app.avatar_directoy)
    },
    filename: function(req, file, callback) {
        let math = app.avatar_type;
        if(math.indexOf(file.mimetype)===-1){
            return callback(transErrors.avatar_type,null);
        }
        console.log(file.originalname)
        let avatarName = `${Date.now()}-${file.originalname}`
        callback(null,avatarName);
      }
})
let avatarUploadFile = multer({
    storage:storageAvatar,
    limits:app.avatar_size
}).single("avatar");

let updateAvatar = (req,res) => {
    avatarUploadFile(req,res,(async error => {
        if(error){
            if(error.message){
                console.log(error)
                return res.status(500).send(transErrors.avatar_size)
            }
            return res.status(500).send(error)
        }
        try{
            let updateUserItem = {
                avatar: req.file.filename,
                updateAt: Date.now()
            };
            let userUpdate = await user.updateUser(req.user._id,updateUserItem);

            await fsExtra.remove(`${app.avatar_directoy}/${userUpdate.avatar}`)
            let result = {
                message: tranSucces.avatar_updated,
                imageSrc: `images/users/${req.file.filename}`
            }
            return res.status(200).send(result)
        }catch(error){
            res.status(500).send(error)
        }
        console.log(req.file);
    }))

}

module.exports = {
    updateAvatar
}