import { Meteor } from "meteor/meteor";
import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Messages } from '/imports/api/messages';
import { MessageList } from 'react-chat-elements'
import DotLoader from "react-spinners/DotLoader";
import './style'

export default ({ scrollToBottom, room }) => {
  const { ready, messages, users } = useTracker(() => {
    const subscription = Meteor.subscribe('messages', room)
    const messages = Messages.find({}, { sort: { createdAt: 1 } }).fetch()
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

  if (!ready) {
    return <div id="loading">
      <center>
        <DotLoader size={80} color="blue" />
      </center>
    </div>
  }

  return <div id="messages">
    <MessageList
      lockable={true}
      toBottomHeight={'100%'}
      dataSource={
        messages.map(message => {
          const user = Meteor.users.findOne(message.owner)
          return {
            position: user._id == Meteor.userId() ? 'right' : 'left',
            type: 'text',
            title: user.username,
            text: message.message,
            date: message.createdAt,
          }
        })
      }
    />
  </div>
};
