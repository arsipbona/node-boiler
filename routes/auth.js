const express = require('express');
const router = express.Router();
const passport   = require('passport')
router.get('/logout',(req,res)=>{
    req.session.destroy(function(err) {
        res.redirect('/');
    });
});
router.post('/login', 
    passport.authenticate('local-login',  
    { 
        successRedirect: '/users',
        failureRedirect: '/'
    }
));

module.exports = router;