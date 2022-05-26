const httpStatus = require('http-status');
const { Conversation, Message } = require('../models');

const startConversation = async (requestBody) => {
  const conv = await Conversation.usersAlreadyHaveConversation(requestBody.senderId, requestBody.recieverId);
  if (conv && conv.length > 0) return conv[0];

  const conversation = await Conversation.create({
    members: [requestBody.senderId, requestBody.recieverId],
  });
  if (!conversation) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Error while creating conversation');
  }
  return conversation;
};

const sendMessage = async (requestBody) => {
  const message = await Message.create({
    senderId: requestBody.senderId,
    text: requestBody.text,
    conversationId: requestBody.conversationId,
  });
  if (!message) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Error while sending message');
  }
  return message;
};

const getMessagesByConversationId = async (conversationId) => {
  const messages = await Message.find({
    conversationId,
  });
  if (!messages) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Messages not found');
  }
  return messages;
};

const getPaginatedMessagesByConversationId = async (filter, options) => {
  const messages = await Message.paginate(filter, options);
  return messages;
};

const getConversations = async (user) => {
  const conversations = await Conversation.find({
    members: { $in: [user.id] },
  }).populate('members');
  if (!conversations) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Conversations not found');
  }
  return conversations;
};

module.exports = {
  startConversation,
  getPaginatedMessagesByConversationId,
  sendMessage,
  getMessagesByConversationId,
  getConversations,
};
