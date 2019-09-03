import mongoose from 'mongoose';
import { user } from '../services';
let Schema = mongoose.Schema;
let ContactSchema = new Schema({
    userId: String,
    contactId: String,
    status: {type:Boolean,default:false },
    createdAt: {type:Number, default: Date.now},
    updatedAt: {type:Number, default: null},
    deletedAt: {type:Number, default: null},
});


ContactSchema.statics = {
    createNew:function(item){
        return this.create(item);
    },
    findAllByUsers: function(userId){
        return this.find({
            $or: [
                {"userId": userId},
                {"contactId": userId}
            ]
        }).exec();
    },
    checkExists: function(userId,contactId){
        return this.findOne({
            $or: [
                { $and: [
                        {"userId": userId},
                        {"contactId": contactId}
                    ]
                },
                { $and: [
                    {"userId": contactId},
                    {"contactId": userId}
                ]
            }
            ]
        }).exec();
    },
    removeRequestContactSent: function(userId,contactId){
        return this.remove({
             $and: [
                {"userId": userId},
                {"contactId": contactId},
                {"status":false}

            ]
        }).exec();
    },
    removeRequestContactReceived: function(userId,contactId){
        return this.remove({
             $and: [
                {"userId": contactId},
                {"contactId": userId},
                {"status":false}

            ]
        }).exec();
    },
    getContactSent: function(userId, limit){
        return this.find({
            $and: [
                {"userId":userId},
                {"status":false}
            ]
        }).sort({"createdAt":-1}).limit(limit).exec();
    },
    getContacts: function(userId,limit){
        return this.find({
            $and: [
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status":true}
            ]
        }).sort({"createdAt":-1}).limit(limit).exec();
    },
    getContactReceived: function(userId, limit){
        return this.find({
            $and: [
                {"contactId":userId},
                {"status":false}
            ]
        }).sort({"createdAt":-1}).limit(limit).exec();
    },
    countAllContacts: function(userId){
        return this.count({
            $and: [
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status":true}
            ]
        }).exec();
    },
    countAllContactReceived: function(userId){
        return this.count({
            $and: [
                {"contactId":userId},
                {"status":false}
            ]
        }).exec();
    },
    countAllContactSent: function(userId){
        return this.count({
            $and: [
                {"userId":userId},              
                {"status":false}
            ]
        }).exec();
    },
    readMoreContacts: function(userId, skip, limit){
        return this.find({
            $and: [
                {$or:[
                    {"userId":userId},
                    {"contactId":userId},
                ]},
                {"status":true}
            ]
        }).sort({"createdAt":-1}).skip(skip).limit(limit).exec();
    },
    readMoreContactSent: function(userId, skip, limit){
        return this.find({
            $and: [
                {"userId":userId},
                {"status":false}
            ]
        }).sort({"createdAt":-1}).skip(skip).limit(limit).exec();
    },
    readMoreContactReceiver : function(userId,skip, limit){
        return this.find({
            $and: [
                {"contactId":userId},
                {"status":false}
            ]
        }).sort({"createdAt":-1}).skip(skip).limit(limit).exec();
    },
    approveRequestContactReceived: function(userId, contactId){
        return this.update({
            $and: [
                    {"userId":contactId},
                    {"contactId":userId},
                    {"status":false}
                ]},
                {"status":true}).exec();
    },
    removeContact:function(userId,contactId){
        return this.remove({
            $or: [
                { $and: [
                        {"userId": userId},
                        {"contactId": contactId},
                         {"status": true}
                    ]
                },
                { $and: [
                    {"userId": contactId},
                    {"contactId": userId},
                    {"status": true}

                ]
            }
            ]
        }).exec();
    },
}
module.exports = mongoose.models.contacts || mongoose.model("contacts",ContactSchema);