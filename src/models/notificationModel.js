import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let NotificationSchema = new Schema({
    sender: {
        id: String,
        username: String,
        avatar: string,
    },
    receiver: {
        id: String,
        username: String,
        avatar: string,
    },
    type: String,
    context: String,
    isRead: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now},
});
module.exports = mongoose.model("contact",NotificationSchema);