const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const ConversationSchema = mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.plugin(toJSON);
ConversationSchema.plugin(paginate);
// ConversationSchema.plugin(deepPopulate);

ConversationSchema.statics.usersAlreadyHaveConversation = async function (senderId, recieverId) {
  const conversations = await this.find({
    members: { $all: [senderId, recieverId] },
  });
  return conversations;
};

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
