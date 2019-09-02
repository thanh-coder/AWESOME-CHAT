import UserModel from '../models/userModel';
import ContactModel from '../models/contactModel';
import notificationModel from '../models/notificationModel';
import _ from 'lodash';
import {notification, user} from './index'

const LIMIT_NUMBER = 1;
let findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let deprecatedUserIds = [currentUserId];
        let contacByUsers =  await ContactModel.findAllByUsers(currentUserId);
        contacByUsers.forEach((contact) => {
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        })
        deprecatedUserIds = _.uniqBy(deprecatedUserIds,keyword);
        let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);
    })
}
let addNew = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
      let contatcExits = await ContactModel.checkExists(currentUserId, contactId);
      if(contatcExits){
          return reject(false);
      }
      let newContactItem = {
          userId:currentUserId,
          contactId
      }
      let newContact = await ContactModel.createNew(newContactItem);
      let NotificationItem = {
          senderId: currentUserId,
          receiverId: contactId,
          type: notificationModel.types.ADD_CONTACT,
      }
      await notificationModel.model.createNew(NotificationItem);
      resolve(newContact) 
    })
}

let removeRequestContactSent = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
      let removeContact = await ContactModel.removeRequestContactSent(currentUserId.toString(), contactId);
      if(removeContact.n == 0 ){
            return reject(false);
        }
        console.log(removeContact)
        // await notificationModel.model.removeRequestContactSentNotification(currentUserId.toString(),contactId,notificationModel.types.ADD_CONTACT)
        resolve(true);
    })
}

let removeRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
      let removeContact = await ContactModel.removeRequestContactReceived(currentUserId.toString(), contactId);
      if(removeContact.n == 0 ){
            return reject(false);
        }
        console.log(removeContact)
        // await notificationModel.model.removeRequestContactReceivedNotification(currentUserId.toString(),contactId,notificationModel.types.ADD_CONTACT)
        resolve(true);
    })
}

let approveRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
      let approveReq = await ContactModel.approveRequestContactReceived(currentUserId.toString(), contactId);
      if(approveReq.nModified == 0 ){
            return reject(false);
        }
        console.log(approveReq)
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: notificationModel.types.APPROVE_CONTACT,
        };
        await notificationModel.model.createNew(notificationItem)
        resolve(true);
    })
}

let getContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
     try{

        let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER);
        // console.log("contacts",contacts)
        let users = contacts.map(async (contact) => {
            if(contact.contactId == currentUserId){
                return await UserModel.getNornalUserById(contact.userId);
            } else{
            return await UserModel.getNornalUserById(contact.contactId);

            }
        })
        resolve(await Promise.all(users));
     } catch(error){
         console.log(error);
     }
     
    })
}

let getContactSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
     try{
        let contacts = await ContactModel.getContactSent(currentUserId.toString(), LIMIT_NUMBER);
        // console.log("getContactSent",contacts)

        let users = contacts.map(async (contact) => {
            return await UserModel.getNornalUserById(contact.contactId);
        })
        resolve(await Promise.all(users));
     } catch(error){
         console.log(error);
     }
     
    })
}

let getContactReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
     try{
        let contacts = await ContactModel.getContactReceived(currentUserId.toString(), LIMIT_NUMBER);
        // console.log("getContactReceived",contacts)
        let users = contacts.map(async (contact) => {
            return await UserModel.getNornalUserById(contact.userId);
        })
        resolve(await Promise.all(users));
     } catch(error){
         console.log(error);
     }
     
    })
}
let countAllContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
     try{
        let count = await ContactModel.countAllContacts(currentUserId.toString());
        resolve(count);
     } catch(error){
        console.log(error);
    }
     
    })
}

let countAllContactSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
     try{
        let count = await ContactModel.countAllContactSent(currentUserId.toString());
        resolve(count);
     } catch(error){
         console.log(error);
     }
     
    })
}

let countAllContactReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
     try{
        let count = await ContactModel.countAllContactReceived(currentUserId.toString());
        resolve(count);
     } catch(error){
        console.log(error);
    }
    })
}

let readMoreContacts = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
     try{
        console.log("currentUserId",skipNumberContacts)

        let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContacts ,LIMIT_NUMBER);
        console.log("newcontacts",newContacts)
        let users = newContacts.map(async (contact) => {
            if(contact.contactId == currentUserId){
                return await UserModel.getNornalUserById(contact.userId);
            } else{
            return await UserModel.getNornalUserById(contact.contactId);
            }
        })
        resolve(await Promise.all(users));
     } catch(error){
         console.log(error);
     }
     
    })
}

let readMoreContactSent = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
     try{

        let newContacts = await ContactModel.readMoreContactSent(currentUserId, skipNumberContacts ,LIMIT_NUMBER);
        console.log("newcontacts",newContacts)
        let users = newContacts.map(async (contact) => {
            return await UserModel.getNornalUserById(contact.contactId);
        })
        resolve(await Promise.all(users));
     } catch(error){
         console.log(error);
     }
     
    })
}

let readMoreContactReceiver = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
     try{

        let newContacts = await ContactModel.readMoreContactReceiver(currentUserId, skipNumberContacts ,LIMIT_NUMBER);
        console.log("newcontacts",newContacts)
        let users = newContacts.map(async (contact) => {
            return await UserModel.getNornalUserById(contact.userId);
        })
        resolve(await Promise.all(users));
     } catch(error){
         console.log(error);
     }
     
    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeRequestContactSent,
    removeRequestContactReceived,
    getContacts,
    getContactSent,
    getContactReceived,
    countAllContacts,
    countAllContactReceived,
    countAllContactSent,
    readMoreContacts,
    readMoreContactSent,
    readMoreContactReceiver,
    approveRequestContactReceived
}