import express from  'express';
let router = express.Router();
import {home, auth} from '../controllers/index'

let initRoutes = (app) => {
    router.get("/", home.getHome)
    router.get("/login-register", auth.getLoginResgiter)

    return app.use("/",router)
}
module.exports = initRoutes;