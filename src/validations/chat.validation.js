const Joi = require('joi');
const { objectId } = require('./custom.validation');

const startConversation = {
  body: Joi.object().keys({
    senderId: Joi.custom(objectId).required(),
    recieverId: Joi.custom(objectId).required(),
  }),
};

const sendMessage = {
  body: Joi.object().keys({
    sender: Joi.object()
      .keys({
        senderName: Joi.string().required(),
        senderId: Joi.custom(objectId).required(),
      })
      .required(),
    text: Joi.string().required(),
    conversationId: Joi.string().required(),
  }),
};

const getMessagesByConversationId = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
};

const getConversationsByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  startConversation,
  sendMessage,
  getMessagesByConversationId,
  getConversationsByUserId,
};
