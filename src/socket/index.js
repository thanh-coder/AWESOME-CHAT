import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import approveRequsetContactReceived from './contact/approveRequsetContactReceived'
import removeContact from './contact/removeContact'
import chatTextEmoji from './chat/chatTextEmoji'
import typingOn from './chat/typingOn'
import typingOff from './chat/typingOff'


let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    approveRequsetContactReceived(io);
    removeContact(io);
    chatTextEmoji(io);
    typingOn(io);
    typingOff(io);
}
module.exports = initSockets;