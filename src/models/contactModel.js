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
    removeRequestContact: function(userId,contactId){
        return this.remove({
             $and: [
                {"userId": userId},
                {"contactId": contactId}
            ]
        }).exec();
    }
}
module.exports = mongoose.model("contact",ContactSchema);