import UserModel from '../models/userModel';
import ContactModel from '../models/contactModel';
import notificationModel from '../models/notificationModel';
import _ from 'lodash';
import {notification} from './index'

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

let removeRequestContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
      let removeContact = await ContactModel.removeRequestContact(currentUserId.toString(), contactId);
      if(removeContact.n == 0 ){
            return reject(false);
        }
        await notificationModel.model.removeRequestContactNotification(currentUserId.toString(),contactId,notificationModel.types.ADD_CONTACT)
        resolve(true);
    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact
}