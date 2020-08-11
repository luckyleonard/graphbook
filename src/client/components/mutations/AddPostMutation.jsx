import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

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

const ADD_POST = gql`
  mutation addPost($post: PostInput!) {
    addPost(post: $post) {
      id
      text
      user {
        username
        avatar
      }
    }
  }
`;

function AddPostMutation({ variables = { page: 0, limit: 10 }, children }) {
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      const data = cache.readQuery({
        query: GET_POSTS,
        variables,
      });
      data.postsFeed.posts.unshift(addPost); //放到最开头
      cache.writeQuery({
        query: GET_POSTS,
        variables,
        data,
      }); //更新缓存,页面展示才会刷新,更新的data格式要和从cache中取出来的一致
    },
  });

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      addPost,
    })
  );
}

export default AddPostMutation;
