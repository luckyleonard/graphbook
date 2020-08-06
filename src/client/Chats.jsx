import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

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

const chats = [
  {
    id: 1,
    users: [
      {
        id: 1,
        avatar: '/uploads/avatar1.png',
        username: 'Test User',
      },
      {
        id: 2,
        avatar: '/uploads/avatar2.png',
        username: 'Test User 2',
      },
    ],
    lastMessage: {
      text: 'This is the last message!',
    },
  },
];
function Chats() {
  return (
    <div className='chats'>
      {chats.map((chat, i) => (
        <div key={chat.id} className='chat'>
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
              <span>{shorten(chat.lastMessage.text)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chats;
