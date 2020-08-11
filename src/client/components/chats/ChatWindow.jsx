import React from 'react';
import AddMessageMutation from '../mutations/AddMessageMutation';
import ChatInput from './ChatInput';

function ChatWindow({ chat, closeChat }) {
  return (
    <div className='chatWindow'>
      <div className='header'>
        <span>{chat.users[1].username}</span>
        <button className='close' onClick={() => closeChat(chat.id)}>
          X
        </button>
      </div>
      <div className='messages'>
        {chat.messages.map((message) => (
          <div
            key={'message' + message.id}
            className={'message ' + (message.user.id > 5 ? 'left' : 'right')}>
            {/* 手动选择了第一个用户以外的那个用户 */}
            {message.text}
          </div>
        ))}
      </div>
      <AddMessageMutation chatId={chat.id}>
        <ChatInput chatId={chat.id} />
      </AddMessageMutation>
    </div>
  );
}
export default ChatWindow;
