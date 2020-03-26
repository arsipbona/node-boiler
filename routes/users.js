const express = require('express');
const router = express.Router();
const { gets, getsJson } = require('../controllers/users');

router.get('/', gets);
router.get('/data', getsJson);
module.exports = router;