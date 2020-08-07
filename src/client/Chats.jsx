import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import OpenChat from './OpenChat';

const GET_CHATS = gql`
  {
    chats {
      id
      users {
        id
        avatar
        username
      }
      lastMessage {
        text
      }
    }
  }
`;

const usernameToString = (users) => {
  const userList = users.slice(1); //去掉chat.users里的第一个用户，也就是自己
  let usernameString = '';
  for (let i = 0; i < userList.length; i++) {
    usernameString += userList[i].username;
    if (i - 1 === userList.length) {
      usernameString += ', ';
    }
  }
  return usernameString;
};

const shorten = (text) => {
  if (text.length > 12) {
    return text.substring(0, text.length - 9) + '...';
  }
  return text;
};

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
  const [textInputs, setTextInputs] = useState({});
  const { loading, error, data } = useQuery(GET_CHATS);

  const openChat = (id) => {
    //用来展开聊天
    let [...cloneChats] = openChats; //解构clone
    let { ...cloneInputs } = textInputs; //Object.assign({}, textInputs);
    if (cloneChats.indexOf(id) === -1) {
      //确保点击的id还未被展开
      if (cloneChats.length > 2) {
        cloneChats = cloneChats.slice(1); //展开第三个则关闭第一个
      }
      cloneChats.push(id);
      cloneInputs[id] = '';
    }
    setOpenChats([...cloneChats]);
    setTextInputs({ ...cloneInputs });
  };

  const closeChat = (id) => {
    //用来关闭聊天
    let [...cloneChats] = openChats;
    let { ...cloneInputs } = textInputs;
    const index = cloneChats.indexOf(id);
    cloneChats.splice(index, 1);
    delete cloneInputs[id];
    setOpenChats([...cloneChats]);
    setTextInputs({ ...cloneInputs });
  };

  const onChangeChatInput = ({ target: { value } }, id) => {
    //用来control用户在聊天中的输入
    event.preventDefault();
    let { ...cloneInputs } = textInputs;
    cloneInputs[id] = value;
    setTextInputs({ ...cloneInputs });
  };

  const handleKeyPress = ({ key }, id, addMessage) => {
    //用来响应回车事件
    const { ...cloneInputs } = textInputs;
    if (key === 'Enter' && textInputs[id].length) {
      addMessage({
        variables: { message: { text: textInputs[id], chatId: id } },
      }).then(() => {
        cloneInputs[id] = '';
        setTextInputs({ ...cloneInputs });
      });
    }
  }; //回车时候才发送addMessage mutation

  if (loading) return 'Loading...';
  if (error) return error.message;
  const { chats } = data;

  return (
    <div className='wrapper'>
      <div className='chats'>
        {chats.map((chat) => (
          <div
            key={'chat' + chat.id}
            className='chat'
            onClick={() => openChat(chat.id)}>
            <div className='header'>
              <img
                src={
                  chat.users.length > 2
                    ? '/public/group.png'
                    : chat.users[1].avatar
                }
              />
              <div>
                <h2>{shorten(usernameToString(chat.users))}</h2>
                <span>
                  {chat.lastMessage && shorten(chat.lastMessage.text)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='openChats'>
        {openChats.map((chatId) => (
          <OpenChat
            key={'chatId' + chatId}
            chatId={chatId}
            closeChat={closeChat}
            textInputs={textInputs}
            onChangeChatInput={onChangeChatInput}
            handleKeyPress={handleKeyPress}
          />
        ))}
      </div>
    </div>
  );
}

export default Chats;
