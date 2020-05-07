import React, { useState } from 'react'
import './style.css'
import { useTracker } from 'meteor/react-meteor-data'
import MessageReader from '/imports/ui/MessageReader'
import FormMessage from '/imports/ui/FormMessage'
import Scroller from '/imports/ui/Scroller'
import AccountsUIWrapper from '/imports/ui/AccountsUIWrapper'
import 'react-chat-elements/dist/main.css'

const sendMessage = (room, message) => {
  Meteor.call('messages.insert', room, message, function (error) {
    if (error) {
      alert(error.error)
    }
  })
}

export const App = () => {
  const [room, setRoom] = useState('')

  const user = useTracker(() => Meteor.user())

  return (
    <div id='container'>
      <div id='header'>
        <center>
          <div> Stock Chat | <a href="https://github.com/leobastiani/stock-chat">GitHub</a></div>
          <input
            id='room'
            placeholder='Main room'
            onChange={e => setRoom(e.target.value)}
            value={room}
          />
        </center>
        <AccountsUIWrapper />
      </div>
      <Scroller className='message-list'>
        {scrollToBottom => (
          <MessageReader scrollToBottom={scrollToBottom} room={room} />
        )}
      </Scroller>
      <div>
        {user && (
          <FormMessage onSubmit={message => sendMessage(room, message)} />
        )}
      </div>
    </div>
  )
}
