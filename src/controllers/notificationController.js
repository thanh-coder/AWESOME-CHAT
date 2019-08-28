import {notification} from "../services/index";

let readMore = async (req,res) => {
    try {
        let skipNumerNotification = +(req.query.skipNumber);
        let newNotifications = await notification.readMore(req.user._id,skipNumerNotification);
        return res.status(200).send(newNotifications);
    } catch(error) {
        console.error();
        return res.status(500).send(error)
    }
}
let markAllAsRead = async (req,res) => {
    try {
        
        let mark = await notification.markAllAsRead(req.user._id,Object.values(req.body));
        console.log(mark)
        return res.status(200).send(mark);
    } catch(error) {
        console.error();
        return res.status(500).send(error)
    }
}
module.exports ={
    readMore,
    markAllAsRead
}