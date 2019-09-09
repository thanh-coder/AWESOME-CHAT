import express from  'express';
import passport from 'passport'
let router = express.Router();
import {home, auth,user,contact,notification, message} from '../controllers/index';
import {authValid,userValid,messageValid} from "../validations/index"
import initPassportLocal from "../controllers/passportController/local";
import initPassportFacebook from "../controllers/passportController/facebook";
import initPassportGoogle from "../controllers/passportController/google";

initPassportLocal();
initPassportFacebook();
initPassportGoogle();
let initRoutes = (app) => {
    router.get("/",auth.checkLogin, home.getHome);
    router.get("/login-register",auth.checkLogout, auth.getLoginResgiter);
    router.post('/register',auth.checkLogout, authValid.register,auth.postRegister)
    router.get('/verify/:token',auth.checkLogout,auth.verifyAccount)
    router.post('/login',auth.checkLogout,passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login-register',
    failureFlash: true,
    successFlash: true
 }));
    router.get("/auth/facebook",auth.checkLogout,passport.authenticate("facebook",{scope:["email"]}));
    router.get("/auth/facebook/callback",auth.checkLogout,passport.authenticate("facebook", { successRedirect: '/',
    failureRedirect: '/login-register',
    failureFlash: true,
    successFlash: true
 }));
 router.get("/auth/google",auth.checkLogout,passport.authenticate("google",{scope:["email"]}));
 router.get("/auth/google/callback",auth.checkLogout,passport.authenticate("google", { successRedirect: '/',
 failureRedirect: '/login-register',
 failureFlash: true,
 successFlash: true
}));
    router.get('/logout',auth.checkLogin,auth.getLogout);
    router.put('/user/update-avatar',auth.checkLogin,user.updateAvatar);
    router.put('/user/update-info',auth.checkLogin,userValid.updateInfo,user.updateInfo);
    router.put('/user/update-password',auth.checkLogin,userValid.updatePassword,user.updatePassword);
    router.get('/contact/find-users/:keyword',auth.checkLogin,contact.findUsersContact);
    router.post('/contact/add-new',auth.checkLogin,contact.addNew);
    router.delete('/contact/remove-request-contact',auth.checkLogin,contact.removeRequestContactSent);
    router.delete('/contact/remove-request-contact-received',auth.checkLogin,contact.removeRequestContactReceived);
    router.delete('/contact/remove-contact',auth.checkLogin,contact.removeContact);
    router.put('/contact/approve-request-contact-received',auth.checkLogin,contact.approveRequestContactReceived);
    router.get('/contact/find-users/:keyword',auth.checkLogin,contact.findUsersContact);
    router.get('/notification/read-more',auth.checkLogin,notification.readMore);
    router.put('/notification/mark-all-as-read',auth.checkLogin,notification.markAllAsRead);
    router.get('/contact/read-more-contacts',auth.checkLogin,contact.readMoreContacts);
    router.get('/contact/read-more-contacts-sent',auth.checkLogin,contact.readMoreContactSent);
    router.get('/contact/read-more-contacts-receiver',auth.checkLogin,contact.readMoreContactReceiver);
    router.post("/message/add-new-text-emoji",auth.checkLogin,messageValid.checkMessageLength,message.addNewTextEmoji)
    router.post("/message/add-new-image",auth.checkLogin,message.addNewImage)
    router.post("/message/add-new-attachment",auth.checkLogin,message.addNewAttachment)
    return app.use("/",router)
}
module.exports = initRoutes;