import React, { useRef, useState } from 'react';
import FakeForm from '/imports/ui/FakeForm';

const Input = (props) => <input type="text" {...props} />
const Button = (props) => <button type="submit" {...props}>Send</button>

export default ({ onSend }) => {
  const [message, setMessage] = useState('')

  const onSubmit = () => {
    onSend(message)
    setMessage('')
  }

  return <>
    <FakeForm onSubmit={onSubmit}>
      <Input onChange={(e) => setMessage(e.target.value)} value={message} />
      <Button />
    </FakeForm>
  </>
};
