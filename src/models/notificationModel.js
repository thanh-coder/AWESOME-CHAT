import mongoose from 'mongoose';
import { user } from '../services';
let Schema = mongoose.Schema;
let NotificationSchema = new Schema({
    senderId: String,
    receiverId: String,
    type: String,
    isRead: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now},
});

NotificationSchema.statics = {
    createNew:function(item){
        return this.create(item);
    },
    removeRequestContactSentNotification: function(senderId, receivedId, type){
        return this.remove({
            $and: [
                {"senderId": senderId},
                {"receiverId": receivedId},
                {"type": type}
            ]
        }).exec();
    },
    getByUserIdAndLimit: function(userId,limit){
        return this.find({"receiverId": userId}).sort({"createdAt": -1}).limit(limit).exec();
    },
    readMore: function(userId,skip,limit){
        return this.find({"receiverId": userId}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },
    countNotifUnread: function(userId){
        return this.count({
            $and: [
                {"receiverId":userId},
                {"isRead":false}
            ]
        }).exec();
    },
    markAllAsRead: function(userId, targetUsers){
        return this.updateMany({
            $and: [
                {"receiverId": userId},
                {"senderId": {$in: targetUsers}}
            ]
        },{"isRead":true}).exec();
    }
}

const NOTIFICATION_TYPES = {
    ADD_CONTACT: "add_contact",
    APPROVE_CONTACT: "approve_contact"
}

const NOTIFICATION_CONTENTS = {
    getContent: (notificationType,isRead,userId,username,userAvatar) => {
        if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT){
            if(!isRead){
                return `
            <div class="notif-readed-false" data-uid="${ userId }">
            <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
            <strong>${username}</strong> đã gửi lời mời kết bạn đến bạn!
            </div>
            `
            }
            return `
            <div data-uid="${ userId }">
            <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
            <strong>${username}</strong> đã gửi lời mời kết bạn đến bạn!
            </div>
            `
        }
        if(notificationType === NOTIFICATION_TYPES.APPROVE_CONTACT){
            if(!isRead){
                return `
            <div class="notif-readed-false" data-uid="${ userId }">
            <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
            <strong>${username}</strong> đa chap nhan loi moi ket ban cua ban!
            </div>
            `
            }
            return `
            <div data-uid="${ userId }">
            <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
            <strong>${username}</strong> đa chap nhan loi moi ket ban cua ban!
            </div>
            `
        }
        return "No matching  with any notifications type"
    }
}

module.exports = {
  model:  mongoose.model("notification",NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENTS
}