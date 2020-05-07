import { Meteor } from "meteor/meteor";
import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Messages } from '/imports/api/messages';
import './style'

const User = ({ children: { username } }) => {
  return <div>
    <span style={{color: 'red', whiteSpace: 'nowrap'}}>{username}</span>:
  </div>
}

const TimeStamp = ({ children: timeStamp }) => {
  return <div style={{color: 'blue', whiteSpace: 'nowrap'}}>{timeStamp.toLocaleDateString()} {timeStamp.toLocaleTimeString()}</div>
}

const MessageText = ({ children: message }) => {
  return <div>{message}</div>
}

const Message = ({ owner, message, createdAt: timeStamp }) => {
  return <div className="post">
    <TimeStamp>{timeStamp}</TimeStamp>
    <User>{Meteor.users.findOne(owner)}</User>
    <MessageText>{message}</MessageText>
  </div>
}

export default ({ scrollToBottom, room }) => {
  const { ready, messages, users } = useTracker(() => {
    const subscription = Meteor.subscribe('messages', room)
    const messages = Messages.find({}, { sort: {createdAt: 1}}).fetch()
    const users = Meteor.users.find({}).fetch()
    return {
      ready: subscription.ready(),
      messages,
      users,
    }
  })

  useEffect(() => {
    ready && scrollToBottom()
  }, [messages])
  
  if(!ready) {
    return 'Loading'
  }

  return <div id="messages">
    {messages.map(post => <Message key={post._id} {...post} />)}
  </div>
};
