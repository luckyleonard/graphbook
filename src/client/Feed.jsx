import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Loading from './components/Loading';
import Error from './components/Error';
import FeedList from './components/posts/FeedList';

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

function Feed() {
  const [postContent, setPostContent] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const variables = { page: 0, limit: 10 };
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    variables,
  }); //Pagination
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

  const loadMore = (fetchMore) => {
    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        if (!fetchMoreResult.postsFeed.posts.length) {
          setHasMore(false);
          return previousResult;
        }
        setPage((page) => page + 1);
        const newData = {
          postsFeed: {
            __typename: 'PostFeed',
            posts: [
              ...previousResult.postsFeed.posts,
              ...fetchMoreResult.postsFeed.posts,
            ],
          },
        };
        return newData;
      },
    });
  };

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
      <FeedList
        hasMore={hasMore}
        fetchMore={fetchMore}
        loadMore={loadMore}
        posts={posts}
      />
    </div>
  );
}
export default Feed;
