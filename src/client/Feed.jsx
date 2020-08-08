import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import InfiniteScroll from 'react-infinite-scroller';

const GET_POSTS = gql`
  {
    posts {
      id
      text
      user {
        avatar
        username
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
function Feed() {
  const [postContent, setPostContent] = useState('');
  const { loading, error, data } = useQuery(GET_POSTS);
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      const { posts } = cache.readQuery({ query: GET_POSTS });
      posts.unshift(addPost);
      cache.writeQuery({ query: GET_POSTS, data: { posts } }); //更新缓存
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
      },
    }).then(() => {
      setPostContent('');
    });
  };

  if (loading) return 'Loading...';
  if (error) return error.message;
  const { posts } = data;

  return (
    <div className='container'>
      <div className='postForm'>
        <form onSubmit={handleSubmit}>
          <textarea
            value={postContent}
            onChange={handlePostContentChange}
            placeholder='Write your custom post!'
          />
          <input type='submit' value='submit' />
        </form>
      </div>
      <div className='feed'>
        {posts.map((post) => (
          <div
            className={'post' + (post.id < 0 ? 'optimistic' : '')}
            key={post.id}>
            <div className='header'>
              <img src={post.user.avatar} />
              <h2>{post.user.username}</h2>
            </div>
            <p className='content'>{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Feed;
