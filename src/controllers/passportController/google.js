import passport from "passport";
import passportGoogle from 'passport-google-oauth';
import config from "dotenv";

import { transErrors, tranSucces, transMail } from "../../lang/vi";
import UserModel from "../../models/userModel";
config.config();

let GoogleStratege = passportGoogle.OAuth2Strategy;
let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;
console.log(ggAppId,ggAppSecret)

let initPassportGoogle = () => {
  passport.use(
    new GoogleStratege(
      {
        clientID: ggAppId,
        clientSecret: ggAppSecret,
        profileFields: ["email", "gender", "displayName"],
        callbackURL: ggCallbackUrl,
        passReqToCallback: true
      },
      async function(req, accessToken, refreshTonken, profile, done) {
        try {
          let user = await UserModel.findByGoogleUid(profile.id);
          if(user){
            return done( null, user,req.flash("success", tranSucces.loginSuccess(user.username)));      
            }
          let newUserItem = {
              username: profile.displayName,
              gender: profile.gender,
              local: {isActive: true},
              google: {
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

module.exports = initPassportGoogle;
