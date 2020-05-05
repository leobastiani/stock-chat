import React from 'react';

export default ({ onSubmit, children }) => {
  const fakeSubmit = (e, ...args) => {
    e.preventDefault()
    onSubmit(e, ...args)
    return false;
  }

  return <form onSubmit={fakeSubmit}>
    {children}
  </form>
};
