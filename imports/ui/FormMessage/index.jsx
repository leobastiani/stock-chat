import React, { useRef } from 'react';

const Input = (props) => <input type="text" {...props} />
const Button = (props) => <button {...props}>Change</button>

export default ({ onSend }) => {
  const inputRef = useRef();

  const onClick = () => {
    const message = inputRef.current.value;
    onSend(message)
  }

  return <>
    <input ref={inputRef} />
    <Button onClick={onClick} />
  </>
};
