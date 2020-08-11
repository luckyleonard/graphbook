import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loading from '../Loading';
import Error from '../Error';

const GET_CHATS = gql`
  query chats {
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

function ChatsQuery({ children }) {
  const { loading, error, data } = useQuery(GET_CHATS);

  if (loading) return <Loading />;
  if (error)
    return (
      <Error>
        <p>{error.message}</p>
      </Error>
    );

  const { chats } = data;
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { chats })
  );
}

export default ChatsQuery;
