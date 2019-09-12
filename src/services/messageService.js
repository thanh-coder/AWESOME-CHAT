import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import {transErrors}  from "../lang/vi";
import {app} from "../config/app";
import _ from "lodash";
import { resolve } from "url";
import { rejects } from "assert";
import fsExtra from "fs-extra"
const LIMIT_CONVERSATION_TAKEN = 4;
const LIMIT_MESSAGES_TAKEN = 12;


let getAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN);
            let userConversationPromise = contacts.map(async (contact) => {
                if(contact.contactId == currentUserId) {
                    let getUserContact = await UserModel.getNornalUserById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getNornalUserById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            })            
                let userConversations =await Promise.all(userConversationPromise)
                let groupConversations =await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION_TAKEN)
                console.log("groupConversations:",groupConversations)
                let allConversations = userConversations.concat(groupConversations);
                allConversations = _.sortBy(allConversations,(item) => {
                    return -item.updatedAt;
                })
                 let allConversationsWithPromise =  allConversations.map(async (conversation) => {
                    conversation = conversation.toObject();
                    if(conversation.members){
                        let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id,LIMIT_CONVERSATION_TAKEN);
                        conversation.messages = _.reverse(getMessages);
                    } else {
                        let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId,conversation._id,LIMIT_CONVERSATION_TAKEN);
                        conversation.messages = _.reverse(getMessages);    
                    }
                    
                    return conversation; 
                })
                let allConversationsWithMessages = await Promise.all(allConversationsWithPromise);
                allConversationsWithMessages = _.sortBy(allConversationsWithMessages, (item) => {
                    return - item.updatedAt;
                })
                 
                resolve({allConversationsWithMessages})
        } catch(error){
            reject(error)
        }
    })
}

let addNewTextEmoji = (sender, receiverId,messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id:getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                }
                let newMessageItem = {
                    senderId:sender.id,
                    receiverId:receiver.id,
                    conversationType:MessageModel.conversationTypes.GROUP,
                    messageType:MessageModel.messageTypes.TEXT,
                    sender:sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                }
                let newMessage =await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1)
                resolve(newMessage);
            } else{
                let getUserReceiver = await UserModel.getNornalUserById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id:getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }
                let newMessageItem = {
                    senderId:sender.id,
                    receiverId:receiver.id,
                    conversationType:MessageModel.conversationTypes.PERSONAL,
                    messageType:MessageModel.messageTypes.TEXT,
                    sender:sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                }
                let newMessage =await MessageModel.model.createNew(newMessageItem);
               await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
                resolve(newMessage)
            }
        
        } catch(error){
            reject(error)
        }
    })
}

let addNewImage = (sender, receiverId,messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id:getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };
                imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId:sender.id,
                    receiverId:receiver.id,
                    conversationType:MessageModel.conversationTypes.GROUP,
                    messageType:MessageModel.messageTypes.IMAGE,
                    sender:sender,
                    receiver: receiver,
                    file: {data:imageBuffer,contentType:imageContentType,filename:imageName},
                    createdAt: Date.now(),
                }
                let newMessage =await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1)
                resolve(newMessage);
            } else{
                let getUserReceiver = await UserModel.getNornalUserById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id:getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;
                let newMessageItem = {
                    senderId:sender.id,
                    receiverId:receiver.id,
                    conversationType:MessageModel.conversationTypes.PERSONAL,
                    messageType:MessageModel.messageTypes.IMAGE,
                    sender:sender,
                    receiver: receiver,
                    file: {data:imageBuffer,contentType:imageContentType,filename:imageName},
                    createdAt: Date.now(),
                }
                let newMessage =await MessageModel.model.createNew(newMessageItem);
               await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
                resolve(newMessage)
            }
        
        } catch(error){
            reject(error)
        }
    })
}

let addNewAttachment = (sender, receiverId,messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id:getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };
                attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;

                let newMessageItem = {
                    senderId:sender.id,
                    receiverId:receiver.id,
                    conversationType:MessageModel.conversationTypes.GROUP,
                    messageType:MessageModel.messageTypes.FILE,
                    sender:sender,
                    receiver: receiver,
                    file: {data:attachmentBuffer,contentType:attachmentContentType,fileName:attachmentName},
                    createdAt: Date.now(),
                }
                let newMessage =await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1)
                resolve(newMessage);
            } else{
                let getUserReceiver = await UserModel.getNornalUserById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id:getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;
                let newMessageItem = {
                    senderId:sender.id,
                    receiverId:receiver.id,
                    conversationType:MessageModel.conversationTypes.PERSONAL,
                    messageType:MessageModel.messageTypes.FILE,
                    sender:sender,
                    receiver: receiver,
                    file: {data:attachmentBuffer,contentType:attachmentContentType,fileName:attachmentName},
                    createdAt: Date.now(),
                }
                let newMessage =await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
                resolve(newMessage)
            }
        
        } catch(error){
            reject(error)
        }
    })
}
module.exports = {
    getAllConversationItems,
    addNewImage,
    addNewTextEmoji,
    addNewAttachment
}