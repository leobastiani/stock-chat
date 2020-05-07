import React, { useState } from 'react';
import './style.css';
import RoomChanger from '/imports/ui/RoomChanger';
import MessageReader from '/imports/ui/MessageReader';
import FormMessage from '/imports/ui/FormMessage';
import Scroller from '../RoomChanger/Scroller';
import AccountsUIWrapper from '/imports/ui/AccountsUIWrapper'

const onSend = (room, message) => {
  Meteor.call('messages.insert', room, 'Leo', message)
}

export const App = () => {
  const [room, setRoom] = useState('test')

  return <div id="container">
    <div>
      <RoomChanger onChange={setRoom} />
      <AccountsUIWrapper />
    </div>
    <Scroller>
      { scrollToBottom => <MessageReader scrollToBottom={scrollToBottom} room={room} /> }
    </Scroller>
    <div><FormMessage onSend={(message) => onSend(room, message)} /></div>
  </div>
};
