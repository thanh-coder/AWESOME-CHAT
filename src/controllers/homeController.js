import {notification}  from '../services/index';
import {contact,message}  from '../services/index';
import {bufferToBase64,convertTimestampToHumanTime,lastItemOfArray} from "../helpers/clientHelper"
let getHome = async (req, res) => {
    let notifications = await notification.getNotifications(req.user._id);
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    let contacts = await contact.getContacts(req.user._id);
    let contactSent = await contact.getContactSent(req.user._id);
    let contactReceived = await contact.getContactReceived(req.user._id);
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactSent = await contact.countAllContactSent(req.user._id);
    let countAllContactReceived = await contact.countAllContactReceived(req.user._id);
    let getAllConversationItems = await message.getAllConversationItems(req.user._id)
    
    let allConversationsWithMessages = await getAllConversationItems.allConversationsWithMessages;
    
    return res.render('main/home/home',{
        success:req.flash("success"),
        user:req.user,
        notifications,
        countNotifUnread,
        contacts,
        contactReceived,
        contactSent,
        countAllContacts,
        countAllContactSent,
        countAllContactReceived,
        allConversationsWithMessages,
        bufferToBase64,
        convertTimestampToHumanTime,
        lastItemOfArray

});
}
module.exports = {
    getHome
}