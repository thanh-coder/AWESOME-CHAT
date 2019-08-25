import UserModel from '../models/userModel';
import ContactModel from '../models/contactModel';
import _ from 'lodash';

let findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let deprecatedUserIds = [currentUserId];
        let contacByUsers =  await ContactModel.findAllByUsers(currentUserId);
        contacByUsers.forEach((contact) => {
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        })
        deprecatedUserIds = _.uniqBy(deprecatedUserIds,keyword);
        console.log(deprecatedUserIds)
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
      resolve(newContact) 
    })
}

let removeRequestContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
      let removeContact = await ContactModel.removeRequestContact(currentUserId.toString(), contactId);
      if(removeContact.n == 0 ){
            return reject(false);
        }
        resolve(true);
    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact
}