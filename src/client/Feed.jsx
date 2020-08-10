import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import FeedList from './components/posts/FeedList';
import PostsFeedQuery from './components/queries/PostsFeedQuery';

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
const variables = { page: 0, limit: 10 };

function Feed() {
  const [postContent, setPostContent] = useState('');

  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      const {
        postsFeed: { posts },
      } = cache.readQuery({
        query: GET_POSTS,
        variables,
      });
      posts.unshift(addPost);
      cache.writeQuery({ query: GET_POSTS, variables, data: { posts } }); //更新缓存
    },
  });

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPost = {
      text: postContent,
    };
    addPost({
      variables: { post: newPost },
      optimisticResponse: {
        //指定fake的返回值
        __typename: 'mutation',
        addPost: {
          __typename: 'Post',
          text: postContent,
          id: -1,
          user: {
            __typename: 'User',
            username: 'Loading...',
            avatar: '/public/loading.gif',
          },
        },
      }, //Optimistic UI
    }).then(() => {
      setPostContent('');
    });
  };

  return (
    <div className='container'>
      <div className='postForm'>
        <form onSubmit={handleSubmit}>
          <textarea
            value={postContent}
            onChange={handlePostContentChange}
            placeholder='Write your custom post!'
          />
          <input type='submit' value='Submit' />
        </form>
      </div>
      <PostsFeedQuery variables={variables}>
        <FeedList />
      </PostsFeedQuery>
    </div>
  );
}
export default Feed;
