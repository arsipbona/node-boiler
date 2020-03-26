const db = require('../config/database');
const Sequelize = require('sequelize');
const DataTable = require('../helpers/MyData');
const User = require('../models/User');
const Op = Sequelize.Op;
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
                    users: userContext(users).userData
                });
            }).catch(err => console.log(err));
    },
    getsJson: (req, res, next) => {
        const requestQuery = req.query;
        // const requestQuery = { "draw": "1", "columns": [{ "data": "0", "name": "", "searchable": "true", "orderable": "true", "search": { "value": "", "regex": "false" } }, { "data": "1", "name": "", "searchable": "true", "orderable": "true", "search": { "value": "", "regex": "false" } }, { "data": "2", "name": "", "searchable": "true", "orderable": "true", "search": { "value": "", "regex": "false" } }, { "data": "3", "name": "", "searchable": "true", "orderable": "true", "search": { "value": "", "regex": "false" } }, { "data": "4", "name": "", "searchable": "true", "orderable": "true", "search": { "value": "", "regex": "false" } }], "order": [{ "column": "0", "dir": "asc" }], "start": "0", "length": "10", "search": { "value": "", "regex": "false" }, "_": "1585231508768" };
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
                db: "password",
                dt: 2
            },
            {
                db: "is_active",
                dt: 3
            }
        ];

        const dataTable = new DataTable(requestQuery, db, tableName, primaryKey, columnsMap, User);

        dataTable.output((err, data) => {
            if (err) {
                console.log(err);
                res.send(500).json({
                    success: 0,
                    message: 'Data Error'
                });
            }
            res.send(data);
        })
        // let output = {
        //     draw: 0,
        //     recordsTotal: 0,
        //     recordsFiltered: 0,
        //     data: requestQuery
        // };
        // res.json(output)
        // res.send('dada' + JSON.stringify(requestQuery));
    }
}