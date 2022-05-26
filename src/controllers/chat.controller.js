const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { chatService } = require('../services');
const pick = require('../utils/pick');

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

const getPaginatedMessagesByConversationId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['conversationId', 'deleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  console.log(options);
  const messages = await chatService.getPaginatedMessagesByConversationId(filter, options);
  res.status(httpStatus.OK).send(messages);
});

const getConversations = catchAsync(async (req, res) => {
  const conversations = await chatService.getConversations(req.user);
  res.status(httpStatus.OK).send(conversations);
});

module.exports = {
  startConversation,
  sendMessage,
  getMessagesByConversationId,
  getConversations,
  getPaginatedMessagesByConversationId,
};
