import {validationResult} from "express-validator/check"
import {auth} from "../services/index";
let getLoginResgiter = (req, res) => {
    return res.render('auth/master',{
        errors: req.flash("errors"),
        success: req.flash("success")
    });
}
let postRegister = async (req, res) => {
  let errorArr = [];
  let successArr = [];
  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
      let errors = Object.values(validationErrors.mapped());
      errors.forEach(item => {
          errorArr.push(item.msg);
      });
      req.flash("errors",errorArr);
      return res.redirect("/login-register");
  }
  try {
  let createUserSuccess = await auth.register(req.body.email,req.body.gender,req.body.password);
  console.log("createUserSuccess:"+createUserSuccess)
  successArr.push(createUserSuccess); 
  req.flash("success",successArr);
  res.redirect("/login-register");
 } catch(err){
     errorArr.push(err);
    req.flash("errors",errorArr);
    return res.redirect("/login-register"); 
  }
}
module.exports = {
    getLoginResgiter,
    postRegister
}