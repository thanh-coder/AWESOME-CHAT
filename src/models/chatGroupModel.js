import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let ChatGroupSchema = new Schema({
    name: String,
    userAmount: {type: Number, min: 3, max: 177},
    messageAmount: {type: Number, default: 0},
    userId: String,
    member: [
        {userId: String}
    ],
    createdAt: {type:Number, default: Date.now},
    updatedAt: {type:Number, default: Date.now},
    deletedAt: {type:Number, default: null},
});
ChatGroupSchema.statics = {
    getChatGroups : function(userId,limit){
        return this.find({
            "members": {$elemMatch:{"userId": userId}}
        }).sort({"updatedAt": -1}).limit(limit).exec();
    },
    getChatGroupById: function(id){
        return this.findById(id).exec();
    },
    updateWhenHasNewMessage : function(id, newMessageAmount){
        return this.findByIdAndUpdate(id,{
            "messageAmount":newMessageAmount,
            "updatedAt": Date.now()
        }).exec();
    }
}

module.exports = mongoose.model("contact",ChatGroupSchema);