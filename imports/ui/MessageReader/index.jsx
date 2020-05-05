import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Posts } from '/imports/api/posts';
import './style'

const User = ({ children: user }) => {
  return <div>
    <span style={{color: 'red', whiteSpace: 'nowrap'}}>{user}</span>:
  </div>
}

const TimeStamp = ({ children: timeStamp }) => {
  return <div style={{color: 'blue', whiteSpace: 'nowrap'}}>{timeStamp.toLocaleDateString()} {timeStamp.toLocaleTimeString()}</div>
}

const Message = ({ children: message }) => {
  return <div>{message}</div>
}

const Post = ({ user, message, createdAt: timeStamp }) => {
  return <div className="post">
    <TimeStamp>{timeStamp}</TimeStamp>
    <User>{user}</User>
    <Message>{message}</Message>
  </div>
}

export default ({ scrollToBottom, room }) => {
  const { ready, posts } = useTracker(() => {
    const subscription = Meteor.subscribe('posts', room)
    const posts = Posts.find({}, { sort: {createdAt: 1}}).fetch()
    return {
      ready: subscription.ready(),
      posts,
    }
  })

  useEffect(() => {
    ready && scrollToBottom()
  }, [posts])
  
  if(!ready) {
    return 'Loading'
  }

  return <div id="posts">
    {posts.map(post => <Post key={post._id} {...post} />)}
  </div>
};
