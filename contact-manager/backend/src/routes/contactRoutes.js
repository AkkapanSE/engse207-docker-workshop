const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');

router.get('/', ctrl.getAllContacts);
router.post('/', ctrl.createContact);
router.delete('/:id', ctrl.deleteContact);

module.exports = router;