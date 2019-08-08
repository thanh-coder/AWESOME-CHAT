import express from 'express';
import ConnectDB from './config/connectDB';
import ContactModel from './models/contact.model'
import config from 'dotenv'

let app = express();
config.config();

ConnectDB();

app.get('/',  async (req, res) => {
  try{
  let item = {
    userId: "1777777",
    contactId: "17000000000000000",
  };
  let contact = await ContactModel.statics.createNew(item);
  res.send(contact);
  }catch(err){
    console.log(err)
  }
});
console.log(process.env.APP_PORT)
let server = app.listen(process.env.APP_PORT,process.env.APP_HOST, function () {
  
  console.log(`Ung dung Node.js dang hoat dong tai dia chi: http:// ${process.env.APP_HOST}:${process.env.APP_PORT}`)
});