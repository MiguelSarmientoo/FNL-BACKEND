const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/messages', messageController.getAllMessages);
router.get('/messages/filtered', messageController.getFilteredMessages);
router.post('/guardarMensaje', messageController.saveMessage);
router.post('/guardarMensajeFromBot', messageController.saveMessageFromBot);

module.exports = router;
