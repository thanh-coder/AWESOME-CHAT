import {validationResult} from "express-validator/check";
import {groupChat}  from "../services/index"
let addNewGroup = async (req, res) => {
    // let errorArr = [];
    // let validationErrors = validationResult(req);
    // if (!validationErrors.isEmpty()) {
    //   let errors = Object.values(validationErrors.mapped());
    //   errors.forEach(item => {
    //     errorArr.push(item.msg);
    //   });
    //   return res.status(500).send(errorArr);
    // }
    try {
        console.log(Object.values(req.body))
        let arrayMemberIds = [];
        for(let prop in req.body){
            console.log(prop);
            if(prop.includes("arrayIds")){
                arrayMemberIds.push({userId:req.body[prop]});
            }
        }
        console.log(arrayMemberIds);

        let currentUserId = req.user._id;
        let groupChatName = req.body.groupChatName;
        let newGroupChat = await groupChat.addNewGroup(currentUserId, arrayMemberIds, groupChatName);
        return res.status(200).send({groupChat:newGroupChat});
    
    } catch(error){
        console.log(error)
        return res.status(500).send(error);

    }
}

module.exports = {
    addNewGroup
}