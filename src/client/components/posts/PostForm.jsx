import React, { useState } from 'react';

function PostForm({ addPost }) {
  const [postContent, setPostContent] = useState('');

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
  );
}

export default PostForm;
