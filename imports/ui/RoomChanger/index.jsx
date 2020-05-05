import React, { useRef } from 'react';
import FakeForm from '/imports/ui/FakeForm';

const Input = (props) => <input placeholder="change room" type="text" {...props} />
const Button = (props) => <button type="submit" {...props}>Change</button>

export default ({ onChange }) => {
  const inputRef = useRef();

  const onSubmit = () => {
    const message = inputRef.current.value;
    inputRef.current.value = '';
    onChange(message)
  }

  return <>
    <FakeForm onSubmit={onSubmit}>
      <input ref={inputRef} />
      <Button />
    </FakeForm>
  </>
};
