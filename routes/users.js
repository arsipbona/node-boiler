const express = require('express');
const router = express.Router();
const {gets} = require('../controllers/users');

router.get('/',gets);

module.exports = router;