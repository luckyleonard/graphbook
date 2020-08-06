import logger from '../../helpers/logger';

// let posts = [
//   {
//     id: 2,
//     text: 'Lorem ipsum',
//     user: {
//       avatar: '/uploads/avatar1.png',
//       username: 'Test User',
//     },
//   },
//   {
//     id: 1,
//     text: 'Lorem ipsum',
//     user: {
//       avatar: '/uploads/avatar2.png',
//       username: 'Test User 2',
//     },
//   },
// ];

export default function resolvers() {
  const { db } = this; //解析数据库
  const { Post, User, Chat, Message } = db.models; //解析数据库models

  const resolvers = {
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    }, //在这里补充type Post中指定的user，获取association的user数据
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      },
    },
    Chat: {
      messages(chat, args, context) {
        return chat.getMessages({ order: [['id', 'ASC']] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
      lastMessage(chat, args, context) {
        return chat
          .getMessages({ limit: 1, order: [['id', 'DESC']] })
          .then((message) => {
            return message[0];
          }); //取最新的message，取得messages数组因为是异步，返回一个Promise，需要then
      },
    },
    RootQuery: {
      posts(root, args, context) {
        return Post.findAll({ order: [['createdAt', 'DESC']] });
      }, //这里只返回了Post数据表的信息，但并没有将user信息一并populate出来
      chat(root, { chatId }, context) {
        return Chat.findByPk(chatId, {
          include: [
            {
              model: User,
              required: true,
            },
            {
              model: Message,
            },
          ],
        });
      },
      chats(root, args, context) {
        return User.findAll().then((users) => {
          if (!users.length) {
            return [];
          }
          const usersRow = users[0]; //暂时只用第一个用户来查询
          return Chat.findAll({
            include: [
              {
                model: User,
                required: true,
                through: { where: { userId: usersRow.id } },
              },
              {
                model: Message,
              },
            ],
          }); //findAll方法来自sequelize 使用include可以避免再次发起一个select避免N+1，带required表示INNER JOIN
        });
      },
    },
    RootMutation: {
      addPost(root, { post }, context) {
        logger.log({ level: 'info', message: 'Post was created' });

        return User.findAll().then((users) => {
          const usersRow = users[0];
          return Post.create({ ...post }).then((newPost) => {
            return Promise.all([newPost.setUser(usersRow.id)]).then(() => {
              //setUser显式指定了user的关联，可以getUser进行查询了
              return newPost;
            });
          });
        });
      },
      addChat(root, { chat }, context) {
        logger.log({ level: 'info', message: 'Chat was created' });

        return Chat.create().then((newChat) => {
          return Promise.all([newChat.setUsers(chat.users)]).then(() => {
            return newChat;
          });
        });
      },
      addMessage(root, { message }, context) {
        logger.log({ level: 'info', message: 'Message was created' });

        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(usersRow.id),
              newMessage.setChat(message.chatId),
            ]).then(() => {
              return newMessage;
            });
          });
        });
      },
    },
  };
  return resolvers;
}
