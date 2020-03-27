const db = require('../config/database');
const Sequelize = require('sequelize');
const DataTable = require('../helpers/MyData');
const User = require('../models/User');
const { hashSync, genSaltSync } = require("bcrypt");
//handle error Access has been denied to resolve the property “from” because it is not an “own property” of its parent 
const userContext = (data) => {
    return {
        userData: data.map(user => {
            return {
                name: user.name,
                handphone: user.handphone,
                password: user.password,
                is_active: user.is_active
            }
        })
    }
}

module.exports = {
    gets: (req, res) => {
        User.findAll()
            .then(async users => {
                res.render('users/index', {
                    users: userContext(users).userData,
                    error: req.flash('error') ,
                    success: req.flash('success')
                    , user:req.user
                });
            }).catch(err => console.log(err));
    },
    // for datatable
    getsJson: (req, res, next) => {
        const requestQuery = req.query;
        const tableName = "users"
        const primaryKey = "id"
        let columnsMap = [
            {
                db: "name",
                dt: 0
            },
            {
                db: "handphone",
                dt: 1
            },
            {
                db: "is_active",
                dt: 2
            }
        ];

        const dataTable = new DataTable(requestQuery, db, tableName, primaryKey, columnsMap, User);

        dataTable.output((err, data) => {
            if (err) {
                
                res.send(500).json({
                    success: 0,
                    message: 'Data Error'
                });
            }
            res.send(data);
        })
    },
    add:(req,res)=>{
        let { name, handphone, password} = req.body;
        const salt = genSaltSync(10);
        password = hashSync(password, salt);
        
        User.create({
            name,
            handphone,
            password
          })
            .then(user => {
                req.flash('success','Add successfully');
                res.redirect('/users');
            })
            .catch(err => {
                req.flash('error','Something wrong try again')
            });
    },
    edit:(req,res)=>{
        const id = req.params.id;
        let { name, handphone } = req.body;
        User.update(
            {
                name,handphone
            },
            { where:{id:id}}
        ).then(result =>{
                req.flash('success','Update successfully');
                res.redirect('/users');
            }
        )
        .catch(err =>{
            req.flash('error','Something wrong try again');
            res.redirect('/users');
            }
        )
    },
    deletes:(req,res)=>{
        const id = req.params.id;
        User.destroy({
            where: {
                id:id
            }
        }).then(result =>{
                req.flash('success','Delete successfully');
                res.redirect('/users');
            }
        )
        .catch(err =>{
            req.flash('error','Something wrong try again');
            res.redirect('/users');
            }
        )
    },
    modalAdd:(req,res)=>{
        res.render('users/add', {layout:'modals'});
    },
    modalEdit:(req,res)=>{
        const id = req.params.id;
        User.findByPk(id).then((user)=> {
            res.render('users/edit', {layout:'modals',user:user.get()});
        }).catch(err=>{
            req.flash('error','Something wrong try again');
            res.redirect('/users');
        })
    },
    modalDelete:(req,res)=>{
        const id = req.params.id;
        User.findByPk(id).then((user)=> {
            res.render('users/delete', {layout:'modals',user:user.get()});
        }).catch(err=>{
            req.flash('error','Something wrong try again');
            res.redirect('/users');
        })
    }
}