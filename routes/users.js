const express = require('express');
const router = express.Router();
const { 
    gets, 
    getsJson,
    add,
    edit,
    deletes ,
    modalAdd,
    modalEdit,
    modalDelete
} = require('../controllers/users');
const authAdmin = require('../middlewares/auth');

router.get('/',authAdmin, gets);
router.get('/data', getsJson);
router.get('/add',modalAdd);
router.get('/edit/:id',modalEdit);
router.get('/delete/:id',modalDelete);
router.post('/add',add);
router.put('/edit/:id',edit);
router.delete('/delete/:id',deletes);

module.exports = router;