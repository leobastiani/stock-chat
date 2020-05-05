import React from 'react';
import './style.css';
import RoomChanger from '/imports/ui/RoomChanger';
import MessageReader from '/imports/ui/MessageReader';
import FormMessage from '/imports/ui/FormMessage';

const onSend = (message) => {
  alert(message)
}

export const App = () => (
  <div id="container">
    <div><RoomChanger /></div>
    <div><MessageReader /></div>
    <div><FormMessage onSend={onSend} /></div>
  </div>
);
