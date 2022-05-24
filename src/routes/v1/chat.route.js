const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const chatValidation = require('../../validations/chat.validation');
const chatController = require('../../controllers/chat.controller');
const router = express.Router();

router.post('/start-conversation', [auth(), validate(chatValidation.startConversation)], chatController.startConversation);
router.post('/send-message', [auth(), validate(chatValidation.sendMessage)], chatController.sendMessage);
router.get(
  '/get-messages/:conversationId',
  [auth(), validate(chatValidation.getMessagesByConversationId)],
  chatController.getMessagesByConversationId
);

router.get(
  '/get-conversations/:userId',
  [auth(), validate(chatValidation.getConversationsByUserId)],
  chatController.getConversationsByUserId
);

module.exports = router;
