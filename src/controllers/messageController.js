import { validationResult } from "express-validator/check";
import { message } from "../services";
import multer from "multer";
import {app} from "../config/app";
import fsExtra from "fs-extra";


let addNewTextEmoji =async (req, res) =>{
    // let errorArr = [];
    // let validationErrors = validationResult(req);
    // if (!validationErrors.isEmpty()) {
    //   let errors = Object.values(validationErrors.mapped());
    //   errors.forEach(item => {
    //     errorArr.push(item.msg);
    //   });
    //   return res.status(500).send(errorArr);
    // }
    try{
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        }
        let receiverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let isChatGroup =  req.body.isChatGroup;
        let newMessage = await message.addNewTextEmoji(sender, receiverId,messageVal, isChatGroup);
        return res.status(200).send({message:newMessage});
        
    } catch(error){
        return res.status(500).send(error);
    }
} 

let storageAvatar = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,app.image_message_directory)
    },
    filename: function(req, file, callback) {
        let math = app.avatar_type;
        if(math.indexOf(file.mimetype)===-1){
            return callback(transErrors.avatar_type,null);
        }
        let imageName = `${Date.now()}-${file.originalname}`
        callback(null,imageName);
      }
})
let imageMessageUploadFile = multer({
    storage:storageAvatar,
    limits:{fileSize:app.image_size}
}).single("my-image-chat");

let addNewImage = (req, res) => {
    imageMessageUploadFile(req,res,async (error) => {
        if(error){
            if(error.message){
                return res.status(500).send(transErrors.image_message_size);
            }
            return res.status(500).send(error);
        }
        try{
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar
            }
            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup =  req.body.isChatGroup;
            let newImages = await message.addNewImage(sender, receiverId,messageVal, isChatGroup);
            await fsExtra.remove(`${app.image_directoy}/${newImages.file.filename}`)
            
            return res.status(200).send({message:newImages});
            
        } catch(error){
            return res.status(500).send(error);
        }
    })
   
} 


let storageAttachment = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,app.attachment_message_directory)
    },
    filename: function(req, file, callback) {
        let attachmentName = `${Date.now()}-${file.originalname}`
        callback(null,attachmentName);
      }
})
let attachmentMessageUploadFile = multer({
    storage:storageAttachment,
    limits:{fileSize:app.attachment_size}
}).single("my-attachment-chat");

let addNewAttachment = (req, res) => {
    attachmentMessageUploadFile(req,res,async (error) => {
        if(error){
            if(error.message){
                return res.status(500).send(transErrors.attachment_message_size);
            }
            return res.status(500).send(error);
        }
        try{
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar
            }
            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup =  req.body.isChatGroup;
            let newAttachment= await message.addNewAttachment(sender, receiverId,messageVal, isChatGroup);
            await fsExtra.remove(`${app.attachment_message_directory}/${newAttachment.file.filename}`)
            
            return res.status(200).send({message:newAttachment});
            
        } catch(error){
            return res.status(500).send(error);
        }
    })
   
} 
module.exports = {
    addNewTextEmoji,
    addNewImage,
    addNewAttachment
}