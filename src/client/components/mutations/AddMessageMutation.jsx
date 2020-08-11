import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

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

function AddMessageMutation({ chatId, children }) {
  const [addMessage] = useMutation(ADD_MESSAGE, {
    update(cache, { data: { addMessage } }) {
      const data = cache.readQuery({
        query: GET_CHAT,
        variables: {
          chatId,
        },
      });
      data.chat.messages.push(addMessage);
      cache.writeQuery({
        query: GET_CHAT,
        variables: { chatId },
        data,
      }); //更新缓存
    },
  });

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { addMessage })
  );
}

export default AddMessageMutation;
