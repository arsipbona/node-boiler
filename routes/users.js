const express = require('express');
const router = express.Router();
const { gets, getsJson } = require('../controllers/users');
const authAdmin = require('../middlewares/auth');

router.get('/',authAdmin, gets);
router.get('/data',authAdmin, getsJson);
// router.post('/login',)
module.exports = router;