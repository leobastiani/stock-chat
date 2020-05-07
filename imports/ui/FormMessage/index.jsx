import React, { useRef, useState } from 'react'
import FakeForm from '/imports/ui/FakeForm'
import { Input, Button } from 'react-chat-elements'

export default ({ onSubmit }) => {
  const el = useRef()

  const onFormSubmit = () => {
    const message = el.current.state.value
    onSubmit(message)
    el.current.clear()
  }

  return (
    <>
      <FakeForm onSubmit={onFormSubmit}>
        <Input
          placeholder='Type here...'
          ref={el}
          rightButtons={
            <Button color='white' backgroundColor='green' text='Send' />
          }
        />
      </FakeForm>
    </>
  )
}
