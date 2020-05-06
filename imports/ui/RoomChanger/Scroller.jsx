import React, { useRef, useState, useEffect } from 'react';

const wrapper = {
  height: '100%',
  overflowY: 'auto',
  overflowX: 'auto',
}

export default ({ children }) => {
  const el = useRef()

  const scrollToBottom = () => {
    const div = el.current
    div.scrollTop = div.scrollHeight
  }

  return <div ref={el} style={wrapper}>
    {children(scrollToBottom)}
  </div>
}