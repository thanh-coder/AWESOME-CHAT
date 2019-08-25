import session from "express-session";
import connectMongo from "connect-mongo";
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);
let MongoStore = connectMongo(session);

// let sessionStore = new MongoStore({
//     url:"mongodb://localhost/awesome_chat",
//     url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
//     autoReconnect: true,
//     autoRemove: "native"
// })
let sessionStore = new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 });

let config = (app) => {
   return app.use(session({
        key:process.env.SESSION_KEY,
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie:{
            maxAge: 1000*60*60*24
        }
    }))
}

module.exports = {
    sessionStore,
    config
};
