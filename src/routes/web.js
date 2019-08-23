import express from  'express';
import passport from 'passport'
let router = express.Router();
import {home, auth,user} from '../controllers/index';
import {authValid} from "../validations/index"
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
    router.put('/user/update-avatar',auth.checkLogin,user.updateAvatar)
    return app.use("/",router)
}
module.exports = initRoutes;