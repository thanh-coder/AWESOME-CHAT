import { validationResult } from "express-validator/check";
import { auth } from "../services/index";
import { tranSucces } from "../lang/vi";
let getLoginResgiter = (req, res) => {
  console.log(req.flash("success"));
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};
let postRegister = async (req, res) => {
  let errorArr = [];
  let successArr = [];
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
  try {
    let createUserSuccess = await auth.register(
      req.body.email,
      req.body.gender,
      req.body.password,
      req.protocol,
      req.get("host")
    );
    successArr.push(createUserSuccess);
    req.flash("success", successArr);
    res.redirect("/login-register");
  } catch (err) {
    errorArr.push(err);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

let verifyAccount = async (req, res) => {
  let errorArr = [];
  let successArr = [];
  try {
    let verifySuccess = await auth.verifyAccount(req.params.token);
    successArr.push(createUserSuccess);
    req.flash("success", successArr);
    res.redirect("/login-register");
  } catch (err) {
    errorArr.push(err);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

let getLogout = (req, res) => {
  req.logout();
  req.flash("success", tranSucces.logout_success);
  return res.redirect("/login-register");
};

let checkLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }
  next();
};
let checkLogout = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};
module.exports = {
  getLoginResgiter,
  postRegister,
  verifyAccount,
  getLogout,
  checkLogin,
  checkLogout
};
