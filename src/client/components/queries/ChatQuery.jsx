import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loading from '../Loading';
import Error from '../Error';

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

function ChatQuery({ variables: { chatId }, children }) {
  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatId },
  });
  if (loading) return <Loading />;
  if (error)
    return (
      <Error>
        <p>{error.message}</p>
      </Error>
    );
  const { chat } = data;

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { chat })
  );
}
export default ChatQuery;
