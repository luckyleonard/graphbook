import React, { Component } from 'react';
import '../../assets/css/style.css';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
import Chats from './Chats';

// const posts = [
//   {
//     id: 2,
//     text: 'Lorem ipsum',
//     user: {
//       avatar: '/uploads/avatar1.png',
//       username: 'Test User',
//     },
//   },
//   {
//     id: 1,
//     text: 'Lorem ipsum',
//     user: {
//       avatar: '/uploads/avatar2.png',
//       username: 'Test User 2',
//     },
//   },
// ];

class App extends Component {
  render() {
    return (
      <div className='container'>
        <Helmet>
          <title>GraphQL - Demo</title>
          <meta
            name='description'
            content='this is a demo project for practice with GraphQL and React'
          />
        </Helmet>
        <Feed />
        <Chats />
      </div>
    );
  }
}
export default App;
