import express from "express";
import ConnectDB from "./config/connectDB";
// import ContactModel from './models/contactModel'
import flash from "connect-flash";
import passport from "passport";
import config from "dotenv";
import bodyParser from "body-parser";
// import https from "https";
// import pem from "pem";

import configViewEngine from "./config/viewEngine";
import configSession from "./config/session";
import initRoutes from "./routes/web";
let app = express();
config.config();

ConnectDB();
configSession(app);
// app.use(session({
//   key:"express.sid",
//   secret: "myscret",
//   // store: sessionStore,
//   resave: true,
//   saveUninitialized: false,
//   cookie:{
//       maxAge: 1000*60*60*24
//   }
// }))

configViewEngine(app);
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(flash());

//config passport
app.use(passport.initialize());
app.use(passport.session());
initRoutes(app);

console.log(process.env.APP_PORT);
let server = app.listen(process.env.APP_PORT, process.env.APP_HOST, function() {
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
