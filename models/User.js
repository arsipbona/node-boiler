const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
  name: {
    type: Sequelize.STRING
  },
  handphone: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  is_active: {
    type: Sequelize.INTEGER
  }
})

module.exports = User;