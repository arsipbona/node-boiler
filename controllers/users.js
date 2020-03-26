const db = require('../config/database');
const Sequelize = require('sequelize');

const User = require('../models/User');
const Op = Sequelize.Op;
//handle error Access has been denied to resolve the property “from” because it is not an “own property” of its parent 
const userContext = (data)=>{
    return {
        userData : data.map(user=>{
            return {
                name : user.name,
                handphone:user.handphone,
                password:user.password,
                is_active:user.is_active
            }
        })
    }
}

module.exports = {
    gets:(req,res)=>{
        User.findAll()
        .then(async users=>{
            res.render('users/index',{
                users:userContext(users).userData
            });
        }).catch(err=>console.log(err));
    }
}