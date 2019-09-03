import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import approveRequsetContactReceived from './contact/approveRequsetContactReceived'
import removeContact from './contact/removeContact'
let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    approveRequsetContactReceived(io);
    removeContact(io);
}
module.exports = initSockets;