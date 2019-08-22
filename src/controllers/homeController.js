let getHome = (req, res) => {
    return res.render('main/home/home',{success:req.flash("success")});
}
module.exports = {
    getHome
}