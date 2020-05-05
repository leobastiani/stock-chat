import React, { useState } from 'react';
import './style.css';
import RoomChanger from '/imports/ui/RoomChanger';
import MessageReader from '/imports/ui/MessageReader';
import FormMessage from '/imports/ui/FormMessage';

const onSend = (message) => {
  alert(message)
}

export const App = () => {
  const [room, setRoom] = useState('test')

  return <div id="container">
    <div><RoomChanger onChange={setRoom} /></div>
    <div><MessageReader room={room} /></div>
    <div><FormMessage onSend={onSend} /></div>
  </div>
};
