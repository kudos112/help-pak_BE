const config = require('../config/config');
const { sendUnreadMessagesEmail } = require('../services/email.service');

const ChatSockets = (socketsServer) => {
  const io = require('socket.io')(socketsServer, {
    cors: {
      origin: config.frontend_url,
      methods: ['GET', 'POST'],
    },
  });

  let users = [];
  let offlineUsers = [];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
  };

  const removeUser = (sid) => {
    users = users.filter((user) => user.socketId !== sid);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  const getOfflineUserIndex = (userId) => {
    return offlineUsers.findIndex((user) => user?.userId === userId);
  };

  const getOfflineUser = (userId) => {
    return offlineUsers.find((user) => user?.userId === userId);
  };

  io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
      if (userId == null) return;
      addUser(userId, socket.id);
      io.emit('getUsers', users);
      console.log(users);
    });

    socket.on('disconnect', () => {
      removeUser(socket.id);
      io.emit('getUsers', users);
      console.log(users);
    });

    socket.on('newNotifications', (userId) => {
      const index = getOfflineUserIndex(userId);
      if (index >= 0)
        io.to(socket.id).emit('getNewNotification', {
          newMessageCount: offlineUsers[index].newMessageCount,
        });
      else
        io.to(socket.id).emit('getNewNotification', {
          newMessageCount: -1,
        });
    });

    socket.on('removeNotification', (userId) => {
      const index = getOfflineUserIndex(userId);
      if (index !== -1) {
        offlineUsers.splice(index, 1);
      }
      console.log('After removing notifications Offline Users', offlineUsers);
    });

    socket.on('sendMessage', ({ senderId, senderName, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user != null) {
        console.log('message sent to', senderId);
        console.log(user);
        io.to(user.socketId).emit('getMessage', {
          senderId,
          senderName,
          text,
        });
      } else {
        const userIndex = getOfflineUserIndex(receiverId);
        console.log(userIndex);
        if (userIndex >= 0) {
          offlineUsers[userIndex].newMessageCount++;
          if (offlineUsers[userIndex].newMessageCount % 5 == 0) sendUnreadMessagesEmail(receiverId);
          console.log(offlineUsers);
        } else {
          offlineUsers.push({
            userId: receiverId,
            newMessageCount: 1,
          });
          console.log(offlineUsers);
        }
      }
    });
  });
};

module.exports = {
  ChatSockets,
};
