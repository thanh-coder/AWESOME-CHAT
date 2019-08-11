import express from  'express';
let router = express.Router();
import {home, auth} from '../controllers/index';
import {authValid} from "../validations/index"

let initRoutes = (app) => {
    router.get("/", home.getHome);
    router.get("/login-register", auth.getLoginResgiter);
    router.post('/register', authValid.register,auth.postRegister)

    return app.use("/",router)
}
module.exports = initRoutes;