import React from 'react';

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

function ChatsList({ chats = [], handleOpenChat }) {
  return (
    <div className='chats'>
      {chats.map((chat) => (
        <div
          key={'chat' + chat.id}
          className='chat'
          onClick={() => handleOpenChat(chat.id)}>
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
              <span>{chat.lastMessage && shorten(chat.lastMessage.text)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatsList;
