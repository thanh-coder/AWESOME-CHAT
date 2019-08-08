import express from 'express';
import ConnectDB from './config/connectDB';
import ContactModel from './models/contact.model'
import config from 'dotenv';
import configViewEngine from './config/viewEngine'

let app = express();
config.config();

ConnectDB();
configViewEngine(app);

app.get('/',  async (req, res) => {
  return res.render("main/master")
});
app.get('/login',  async (req, res) => {
  return res.render("auth/loginRegister")
});
console.log(process.env.APP_PORT)
let server = app.listen(process.env.APP_PORT,process.env.APP_HOST, function () {
  
  console.log(`Ung dung Node.js dang hoat dong tai dia chi: http:// ${process.env.APP_HOST}:${process.env.APP_PORT}`)
});