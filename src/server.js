import express from "express";
import ConnectDB from "./config/connectDB";
// import ContactModel from './models/contactModel'
import flash from "connect-flash";
import passport from "passport";
import config from "dotenv";
import bodyParser from "body-parser";
import http from "http";
import socketio from "socket.io";
import cookieParser from 'cookie-parser'



// import pem from "pem";

import configViewEngine from "./config/viewEngine";
import session from "./config/session";
import initRoutes from "./routes/web";
import initSockets from "./socket/index"
import configSocketIo from './config/socketio';
import event from "events";
event.EventEmitter.defaultMaxListeners = 30;
let app = express();
let server = http.createServer(app);
let io = socketio(server);
config.config();

ConnectDB();
session.config(app);

configViewEngine(app);
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(flash());
app.use(cookieParser());

//config passport
app.use(passport.initialize());
app.use(passport.session());
initRoutes(app);
configSocketIo(io);
initSockets(io);


console.log(process.env.APP_PORT);
server.listen(process.env.APP_PORT, process.env.APP_HOST, function() {
  console.log(
    `Ung dung Node.js dang hoat dong tai dia chi: http:// ${
      process.env.APP_HOST
    }:${process.env.APP_PORT}`
  );
});

// pem.createCertificate({ days: 1, selfSigned: true }, function(err, keys) {
//   if (err) {
//     throw err;
//   }
//   let app = express();
//   config.config();

// ConnectDB();
// configSession(app);
// configViewEngine(app);
// app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());
// app.use(flash());

// //config passport
// app.use(passport.initialize());
// app.use(passport.session());
// initRoutes(app);
//   https.createServer({ key: keys.serviceKey, cert: keys.certificate },app)
//     .listen(process.env.APP_PORT, process.env.APP_HOST, function() {
//       console.log(
//         `Ung dung Node.js dang hoat dong tai dia chi: http:// ${
//           process.env.APP_HOST
//         }:${process.env.APP_PORT}`
//       );
//     });
    
// });
