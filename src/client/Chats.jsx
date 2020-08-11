import React, { useState } from 'react';
import ChatsQuery from './components/queries/ChatsQuery';
import ChatQuery from './components/queries/ChatQuery';

import ChatsList from './components/chats/ChatsList';
import ChatWindow from './components/chats/ChatWindow';

// const chats = [
//   {
//     id: 1,
//     users: [
//       {
//         id: 1,
//         avatar: '/uploads/avatar1.png',
//         username: 'Test User',
//       },
//       {
//         id: 2,
//         avatar: '/uploads/avatar2.png',
//         username: 'Test User 2',
//       },
//     ],
//     lastMessage: {
//       text: 'This is the last message!',
//     },
//   },
// ];

function Chats() {
  const [openChats, setOpenChats] = useState([]);

  const handleOpenChat = (id) => {
    //用来展开聊天
    let [...cloneChats] = openChats; //解构clone
    // let { ...cloneInputs } = textInputs; //Object.assign({}, textInputs);
    if (cloneChats.indexOf(id) === -1) {
      //确保点击的id还未被展开
      if (cloneChats.length > 2) {
        cloneChats = cloneChats.slice(1); //展开第三个则关闭第一个
      }
      cloneChats.push(id);
    }
    setOpenChats([...cloneChats]);
  };

  const closeChat = (id) => {
    //用来关闭聊天
    let [...cloneChats] = openChats;
    const index = cloneChats.indexOf(id);
    cloneChats.splice(index, 1);
    setOpenChats([...cloneChats]);
  };

  return (
    <div className='wrapper'>
      <ChatsQuery>
        <ChatsList handleOpenChat={handleOpenChat} />
      </ChatsQuery>
      <div className='openChats'>
        {openChats.map((chatId) => (
          <ChatQuery key={'chatId' + chatId} variables={{ chatId }}>
            <ChatWindow closeChat={closeChat} />
          </ChatQuery>
        ))}
      </div>
    </div>
  );
}

export default Chats;
