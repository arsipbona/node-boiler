const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
module.exports = (passport)=>{
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser((id, done)=> {
        User.findByPk(id).then((user)=> {
            if(user){
                done(null, user.get());
            }
            else{
                done(user.errors,null);
            }
        });
    });
    // default field username and password
    passport.use('local-login',new LocalStrategy({
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req,name,password,done)=>{
        const isValidPassword = (userpass, password)=> {
            return userpass==password;
            // return bCrypt.compareSync(password, userpass);
        }
        User.findOne({
            where:{
                name:name
            }
        }).then(user=>{
            if(!user){
                return done(null,false,req.flash('error','Incorrect name or password'));                
            }
            if (!isValidPassword(user.password, password)) { 
                return done(null, false, req.flash('error','Incorrect name or password')); 
            }
            const userinfo = user.get();
            return done(null,userinfo);
        }).catch((err)=> {
            console.log("Error:", err);
            return done(null, false, req.flash('error','Something went wrong with your Signin'));
        });
 
    }));
}