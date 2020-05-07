import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Messages } from '/imports/api/messages';
import './style'

const User = ({ children: username }) => {
  return <div>
    <span style={{color: 'red', whiteSpace: 'nowrap'}}>{username}</span>:
  </div>
}

const TimeStamp = ({ children: timeStamp }) => {
  return <div style={{color: 'blue', whiteSpace: 'nowrap'}}>{timeStamp.toLocaleDateString()} {timeStamp.toLocaleTimeString()}</div>
}

const Message = ({ children: message }) => {
  return <div>{message}</div>
}

const Post = ({ username, message, createdAt: timeStamp }) => {
  return <div className="post">
    <TimeStamp>{timeStamp}</TimeStamp>
    <User>{username}</User>
    <Message>{message}</Message>
  </div>
}

export default ({ scrollToBottom, room }) => {
  const { ready, messages } = useTracker(() => {
    const subscription = Meteor.subscribe('messages', room)
    const messages = Messages.find({}, { sort: {createdAt: 1}}).fetch()
    return {
      ready: subscription.ready(),
      messages,
    }
  })

  useEffect(() => {
    ready && scrollToBottom()
  }, [messages])
  
  if(!ready) {
    return 'Loading'
  }

  return <div id="messages">
    {messages.map(post => <Post key={post._id} {...post} />)}
  </div>
};
