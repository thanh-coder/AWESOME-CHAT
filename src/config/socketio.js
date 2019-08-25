import passportSocketIo from "passport.socketio";
import cookieParser  from 'cookie-parser';
import session from "./session";

let configSocketIo = (io) => {
    io.use( passportSocketIo.authorize({
        cookieParser: cookieParser,
        key:          process.env.SESSION_KEY,       // the name of the cookie where express/connect stores its session_id
        secret:       process.env.SESSION_SECRET,    // the session_secret to parse the cookie
        store:       session.sessionStore,        // we NEED to use a sessionstore. no memorystore please
        success:     (data,accept) => {
          if(!data.user.logged_in){
            return accept("invalid user", false)
          }
          return accept(null, true)
        },  // *optional* callback on success - read more below
        fail:(data, message, error, accept) => {
          if(error){
            console.log("failed connection socketio",message);
            return accept(new Error(message), false)
          }
        }     // *optional* callback on fail/error - read more below
      }));
}
module.exports = configSocketIo;