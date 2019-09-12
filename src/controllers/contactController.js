import {contact} from "../services/index";
import {validationResult} from "express-validator/check";

let findUsersContact = async (req, res) => {
    let errorArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach(item => {
        errorArr.push(item.msg);
      });
      return res.status(500).send(errorArr);
    }
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.findUsersContact(currentUserId, keyword);
        return res.render("main/contact/sections/findUserContact",{users});
    
    } catch(error){
        return res.status(500).send(error);

    }
}

let searchFriends = async (req, res) => {
    let errorArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach(item => {
        errorArr.push(item.msg);
      });
      return res.status(500).send(errorArr);
    }
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.searchFriends(currentUserId, keyword);
        return res.render("main/groupChat/sections/_searchFriends",{users});
    
    } catch(error){
        console.log(error)
        return res.status(500).send(error);

    }
}

let addNew = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let newContact = await contact.addNew(currentUserId, contactId);
        return res.status(200).send({success:!!newContact})
    } catch(error){
        console.log(error)
        return res.status(500).send(error);

    }
}

let removeRequestContactSent = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let removeContact = await contact.removeRequestContactSent(currentUserId, contactId);
        return res.status(200).send({success:!!removeContact})
    } catch(error){
        return res.status(500).send(error);

    }
}

let readMoreContacts =  async (req,res) => {
    try {
        let skipNumerNotification = +(req.query.skipNumber);
        let newContactUsers = await contact.readMoreContacts(req.user._id,skipNumerNotification);
        return res.status(200).send(newContactUsers);
    } catch(error) {
        console.error();
        return res.status(500).send(error)
    }
}
let readMoreContactReceiver =  async (req,res) => {
    try {
        let skipNumerNotification = +(req.query.skipNumber);
        let newContactUsers = await contact.readMoreContactReceiver(req.user._id,skipNumerNotification);
        return res.status(200).send(newContactUsers);
    } catch(error) {
        console.log(error);
        return res.status(500).send(error)
    }
};

let readMoreContactSent =  async (req,res) => {
    try {
        let skipNumerNotification = +(req.query.skipNumber);
        let newContactUsers = await contact.readMoreContactSent(req.user._id,skipNumerNotification);
        return res.status(200).send(newContactUsers);
    } catch(error) {
        console.log(error);
        return res.status(500).send(error)
    }
}


let removeRequestContactReceived =  async (req,res) => {
    try {
        let contactId = req.body.uid;
        let removeContact = await contact.removeRequestContactReceived(req.user._id,contactId);
        return res.status(200).send({success:!!removeContact})
    } catch(error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

let removeContact = async (req,res) => {
    try {
        let contactId = req.body.uid;
        let removeContact = await contact.removeContact(req.user._id,contactId);
        return res.status(200).send({success:!!removeContact})
    } catch(error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

let approveRequestContactReceived =  async (req,res) => {
    try {
        let contactId = req.body.uid;
        let removeContact = await contact.approveRequestContactReceived(req.user._id,contactId);
        return res.status(200).send({success:!!removeContact})
    } catch(error) {
        console.log(error);
        return res.status(500).send(error)
    }
}
module.exports = {
    findUsersContact,
    searchFriends,
    addNew,
    removeRequestContactSent,
    approveRequestContactReceived,
    removeRequestContactReceived,
    readMoreContacts,
    readMoreContactSent,
    removeContact,
    readMoreContactReceiver
}