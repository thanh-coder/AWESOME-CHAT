import passport from "passport";
import facebookStrategy from "passport-facebook";
import config from "dotenv";

import { transErrors, tranSucces, transMail } from "../../lang/vi";
import UserModel from "../../models/userModel";
import ChatGroupModel from "../../models/chatGroupModel"
config.config();

let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbCallbackUrl = process.env.FB_CALLBACK_URL;
console.log(fbAppId,fbAppSecret)

let initPassportFacebook = () => {
  passport.use(
    new facebookStrategy(
      {
        clientID: fbAppId,
        clientSecret: fbAppSecret,
        profileFields: ["email", "gender", "displayName"],
        callbackURL: fbCallbackUrl,
        passReqToCallback: true
      },
      async function(req, accessToken, refreshTonken, profile, done) {
        try {
          let user = await UserModel.findByFaceBookUid(profile.id);
          if(user){
            return done( null, user,req.flash("success", tranSucces.loginSuccess(user.username)));      
            }
          console.log(profile);
          let newUserItem = {
              username: profile.displayName,
              gender: profile.gender,
              local: {isActive: true},
              facebook: {
                  uid: profile.id,
                  token: accessToken,
                  email: profile.emails[0].value
              }
          }
          let newUser = await UserModel.createNew(newUserItem)
          return done( null, newUser,req.flash("success", tranSucces.loginSuccess(newUser.username)));      

        } catch (err) {
          console.log(err);
          return done(null, false, req.flash("errors", transErrors.server_err));
        }
      }
    )
  );
};
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  try{
    let user = UserModel.findUserByIdForSessionToUse(id);
    let getChatGroupIds =  await ChatGroupModel.getChatGroupIdsUser(user._id);
    user = user.toObject();
    user.chatGroupIds = getChatGroupIds;
    return done(null, user);     
} catch(error){
    return done(error, null)
}
});

module.exports = initPassportFacebook;
