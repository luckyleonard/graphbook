import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        avatar
        username
      }
      messages {
        id
        text
        user {
          id
        }
      }
    }
  }
`;

function ChatId({ chatId, closeChat }) {
  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatId },
  });
  if (loading) return 'Loading...';
  if (error) return error.message;
  const { chat } = data;

  return (
    <div className='chatWindow'>
      <div className='header'>
        <span>{chat.users[1].username}</span>
        <button className='close' onClick={() => closeChat(chatId)}>
          X
        </button>
      </div>
      <div className='messages'>
        {chat.messages.map((message) => (
          <div
            key={'message' + message.id}
            className={'message ' + (message.user.id > 1 ? 'left' : 'right')}>
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatId;
