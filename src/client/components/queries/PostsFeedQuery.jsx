import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loading from '../Loading';
import Error from '../Error';

const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
      posts {
        id
        text
        user {
          avatar
          username
        }
      }
    }
  }
`;

function PostsFeedQuery({ variables = { page: 0, limit: 10 }, children }) {
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    variables,
  }); //Pagination

  if (loading) return <Loading />;
  if (error)
    return (
      <Error>
        <p>{error.message}</p>
      </Error>
    );

  const {
    postsFeed: { posts },
  } = data;

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { posts, fetchMore })
  ); //compound pattern
}

export default PostsFeedQuery;
