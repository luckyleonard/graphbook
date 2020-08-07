import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

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

const ADD_MESSAGE = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
      user {
        id
      }
    }
  }
`;

function ChatId({
  chatId,
  closeChat,
  textInputs,
  onChangeChatInput,
  handleKeyPress,
}) {
  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatId },
  });
  const [addMessage] = useMutation(ADD_MESSAGE, {
    update(cache, { data: { addMessage } }) {
      const {
        chat: { messages },
      } = cache.readQuery({
        query: GET_CHAT,
        variables: {
          chatId,
        },
      });
      messages.push(addMessage);
      cache.writeQuery({
        query: GET_CHAT,
        variables: { chatId },
        data: {
          chat: { messages },
        },
      }); //更新缓存
    },
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
            className={'message ' + (message.user.id > 5 ? 'left' : 'right')}>
            {/* 手动选择了第一个用户以外的那个用户 */}
            {message.text}
          </div>
        ))}
      </div>
      <div className='input'>
        <input
          type='text'
          value={textInputs[chatId]}
          onChange={(event) => onChangeChatInput(event, chatId)}
          onKeyPress={(event) => handleKeyPress(event, chatId, addMessage)}
        />
      </div>
    </div>
  );
}

export default ChatId;
