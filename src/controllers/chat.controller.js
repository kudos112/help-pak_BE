const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { chatService } = require('../services');

const startConversation = catchAsync(async (req, res) => {
  const conversation = await chatService.startConversation(req.body);
  res.status(httpStatus.CREATED).send(conversation);
});

const sendMessage = catchAsync(async (req, res) => {
  const message = await chatService.sendMessage(req.body);
  res.status(httpStatus.OK).send(message);
});

const getMessagesByConversationId = catchAsync(async (req, res) => {
  const messages = await chatService.getMessagesByConversationId(req.params.conversationId);
  res.status(httpStatus.OK).send(messages);
});

const getConversationsByUserId = catchAsync(async (req, res) => {
  const conversations = await chatService.getConversationsByUserId(req.params.userId);
  res.status(httpStatus.OK).send(conversations);
});

module.exports = { startConversation, sendMessage, getMessagesByConversationId, getConversationsByUserId };
