import React from 'react';
import FeedList from './components/posts/FeedList';
import PostsFeedQuery from './components/queries/PostsFeedQuery';
import AddPostMutation from './components/mutations/AddPostMutation';
import PostForm from './components/posts/PostForm';

const variables = { page: 0, limit: 10 };

function Feed() {
  return (
    <div className='container'>
      <AddPostMutation variables={variables}>
        <PostForm />
      </AddPostMutation>
      <PostsFeedQuery variables={variables}>
        <FeedList />
      </PostsFeedQuery>
    </div>
  );
}
export default Feed;
