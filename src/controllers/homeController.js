import {notification}  from '../services/index'
let getHome = async (req, res) => {
    let notifications = await notification.getNotifications(req.user._id);
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    return res.render('main/home/home',{success:req.flash("success"),user:req.user,notifications,countNotifUnread});
}
module.exports = {
    getHome
}