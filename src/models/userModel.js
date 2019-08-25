import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
let Schema = mongoose.Schema;
let UserSchema = new Schema({
    username: String,
    gender: {type:String, default: "male"},
    phone: {type:String, default: null},
    address: {type: String, default: null},
    avatar: {type: String, default: "avatar-default.jpg"},
    role:{type: String, default: "user"},
    local: {
        email: {type: String, trim: true},
        password: String,
        isActive : {type:Boolean, default: false},
        verifyToken: String
    },
    facebook: {
        uid: String,
        token: String,
        email: {type: String, trim: true},
    },
    google:{
        uid: String,
        token: String,
        email: {type: String, trim: true},
    },
    createdAt: {type:Number, default: Date.now},
    updatedAt: {type:Number, default: null},
    deletedAt: {type:Number, default: null},
});

UserSchema.statics = {
    findByEmail: function(email) {
            return this.findOne({"local.email":email}).exec(); 
    },
    createNew: function(item){
        return this.create(item)
   },
   removeById: function(id){
    return this.findByIdAndRemove(id).exec();
   },
   verifyToken: function(token){
    return this.findOneAndUpdate({"local.verifyToken":token},
    {"local.isActive":true,"local.verifyToken":null}).exec();
   },
   findUserById: function(id){
       return this.findById(id).exec();
   },
   findByFaceBookUid: function(uid){
       return this.findOne({"facebook.uid":uid}).exec();
   },
   findByGoogleUid: function(uid){
    return this.findOne({"google.uid":uid}).exec();
    },
    updateUser: function(id,item) {
        return this.findByIdAndUpdate(id,item).exec();
    },
       updatePassword: function(id,hasPassword) {
        return this.findByIdAndUpdate(id,{"local.password":hasPassword}).exec();
    },
    findAllForAddContact: function(deprecatedUserIds, keyword){
        return this.find({
            $and: [
                {"_id": {$nin: deprecatedUserIds}},
                {"local.isActive": true},
                {
                    $or: [
                        {"username": {"$regex":new RegExp(keyword, "i")}},
                        {"local.email": {"$regex": new RegExp(keyword, "i")}},
                        {"facebook.email": {"$regex": new RegExp(keyword, "i")}},
                        {"google.email": {"$regex": new RegExp(keyword, "i")}},
                    ]
                }
            ]
        },{_id:1,username:1,address:1,phone:1})
    }
}

UserSchema.methods = {
    comparePassword: function(password){
        return bcrypt.compare(password,this.local.password);
    }
}

module.exports = mongoose.model("user",UserSchema);