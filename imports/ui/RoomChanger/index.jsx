import React, { useRef, useState } from 'react';
import FakeForm from '/imports/ui/FakeForm';

const Input = (props) => <input placeholder="change room" type="text" {...props} />
const Button = (props) => <button type="submit" {...props}>Change</button>

export default ({ onChange }) => {
  const [input, setInput] = useState('')

  const onSubmit = () => {
    onChange(input)
    setInput('')
  }

  return <>
    <FakeForm onSubmit={onSubmit}>
      <Input onChange={(e) => setInput(e.target.value)} value={input} />
      <Button />
    </FakeForm>
  </>
};
