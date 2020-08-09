import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

function FeedList({ hasMore, fetchMore, loadMore, posts }) {
  return (
    <div className='feed'>
      <InfiniteScroll
        loadMore={() => loadMore(fetchMore)}
        hasMore={hasMore}
        loader={
          <div className='loader' key='loader'>
            Loading...
          </div>
        }>
        {posts.map((post) => (
          <div
            className={'post' + (post.id < 0 ? 'optimistic' : '')}
            key={post.id}>
            {/*optimisitic UI 在submit中设定的post.id 为 -1*/}
            <div className='header'>
              <img src={post.user.avatar} />
              <h2>{post.user.username}</h2>
            </div>
            <p className='content'>{post.text}</p>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
export default FeedList;
