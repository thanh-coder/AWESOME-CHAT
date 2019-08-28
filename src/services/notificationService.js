import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

const LIMIT_NUMBER = 1;
let getNotifications = (currentUserId) => {
    return new Promise(async (resolve,reject) => {
        try{
            let limit = 10;
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId,LIMIT_NUMBER);
            let getNotifiContents = notifications.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead,sender._id,sender.username,sender.avatar)
            })
            resolve(await Promise.all(getNotifiContents))
      
        } catch(error){
            reject(error)
        }
    })
}
let countNotifUnread = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let notificationUnread = await NotificationModel.model.countNotifUnread(currentUserId);
            resolve(notificationUnread);
        }catch(error){
            reject(error)
        }

    })
}
let readMore = (currentUserId,skipNumerNotification) => {
    return new Promise(async (resolve,reject) => {
        try{
            let notifications = await NotificationModel.model.readMore(currentUserId,skipNumerNotification,LIMIT_NUMBER);
            let getNotifiContents = notifications.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead,sender._id,sender.username,sender.avatar)
            })
            resolve(await Promise.all(getNotifiContents))
      
        } catch(error){
            reject(error)
        }
    })
}

let markAllAsRead = (currentUserId,targetUsers) => {
    return new Promise(async (resolve,reject) => {
        try{
            console.log(currentUserId,targetUsers)
            await NotificationModel.model.markAllAsRead(currentUserId,targetUsers);
            resolve(true)
        } catch(error){
            reject(false)
        }
    })
}
module.exports ={
    getNotifications,
    countNotifUnread,
    readMore,
    markAllAsRead
}