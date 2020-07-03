import React, { Component } from 'react';
import '../../assets/css/style.css';
import { Helmet } from 'react-helmet';

const posts = [
  {
    id: 2,
    text: 'Lorem ipsum',
    user: {
      avatar: '/uploads/avatar1.png',
      username: 'Test User',
    },
  },
  {
    id: 1,
    text: 'Lorem ipsum',
    user: {
      avatar: '/uploads/avatar2.png',
      username: 'Test User 2',
    },
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: posts,
      postContent: '',
    };
    this.handlePostContentChange = this.handlePostContentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handlePostContentChange(event) {
    this.setState({ ...this.state, postContent: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    const { posts, postContent } = this.state;
    const newPost = {
      id: posts.length + 1,
      text: postContent,
      user: {
        avatar: '/uploads/avatar1.png',
        userName: 'Fake user',
      },
    };
    this.setState((prev) => ({
      posts: [newPost, ...prev.posts],
      postContent: '',
    }));
  }

  render() {
    const { posts, postContent } = this.state;
    return (
      <div className='container'>
        <Helmet>
          <title>GraphQL - Demo</title>
          <meta
            name='description'
            content='this is a demo project for practice with GraphQL and React'
          />
        </Helmet>
        <div className='postForm'>
          <form onSubmit={this.handleSubmit}>
            <textarea
              value={postContent}
              onChange={this.handlePostContentChange}
              placeholder='Write your custom post!'
            />
            <input type='submit' value='submit' />
          </form>
        </div>
        <div className='feed'>
          {posts.map((post) => (
            <div className='post' key={post.id}>
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
}
export default App;
