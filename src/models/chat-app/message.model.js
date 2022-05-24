const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const deepPopulate = require('mongoose-deep-populate')(mongoose);

const MessageSchema = mongoose.Schema(
  {
    sender: {
      type: {
        senderName: {
          type: String,
          required: true,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    deleted: {
      type: Boolean,

      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.plugin(toJSON);
MessageSchema.plugin(paginate);
MessageSchema.plugin(deepPopulate);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
