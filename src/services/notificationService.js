import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

let getNotifications = (currentUserId) => {
    return new Promise(async (resolve,reject) => {
        try{
            let limit = 10;
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId,limit);
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

module.exports ={
    getNotifications,
    countNotifUnread
}