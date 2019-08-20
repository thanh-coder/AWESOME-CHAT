import express from 'express';
import ConnectDB from './config/connectDB';
// import ContactModel from './models/contactModel'
import flash from 'connect-flash'

import config from 'dotenv';
import configViewEngine from './config/viewEngine';
import configSession from './config/session';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';

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
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
app.use(flash());

initRoutes(app);

console.log(process.env.APP_PORT)
let server = app.listen(process.env.APP_PORT,process.env.APP_HOST, function () {
  
  console.log(`Ung dung Node.js dang hoat dong tai dia chi: http:// ${process.env.APP_HOST}:${process.env.APP_PORT}`)
});