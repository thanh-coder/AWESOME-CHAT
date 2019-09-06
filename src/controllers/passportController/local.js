 import passport from 'passport'
 import LocalStrategy from 'passport-local';
 import {transErrors,tranSucces, transMail} from "../../lang/vi";
 import UserModel from "../../models/userModel";
 import ChatGroupModel from "../../models/chatGroupModel";

 let initPassportLocal = () => {
     passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
     }, async function(req,email, password, done) {
            try{
               let user = await UserModel.findByEmail(email);
                    if (!user) {
                        return done(null, false, req.flash("errors",transErrors.login_failed));
                    }
                    if (!user.local.isActive) {
                        console.log("loi active"+user.local.isActive);
                        return done(null, false, req.flash("errors",transErrors.account_not_active));
                    }
                    let checkPassword = await user.comparePassword(password);
                    if(!checkPassword){
                        return done(null, false, req.flash("errors",transErrors.login_failed));
                    }
                    return done(null, user,req.flash("success",tranSucces.loginSuccess(user.username)));
            }catch(err){
                console.log(err);
                return done(null, false,req.flash("errors",transErrors.server_err));
            }
            
        }
   ))
 }
 passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
    try{
        let user = await UserModel.findUserByIdForSessionToUse(id);
        console.log(user);
        let getChatGroupIds =  await ChatGroupModel.getChatGroupIdsUser(user._id);
        user = user.toObject();
        user.chatGroupIds = getChatGroupIds;
        return done(null, user);     
    } catch(error){
        return done(error, null)
    }
   
});

module.exports = initPassportLocal;