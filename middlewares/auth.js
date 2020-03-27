module.exports = function(req,res,next) {
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
    // if (req.session.role === 'admin') {
    //     next();
    // } else {
    //     res.render('unauthorized');
    // }
}