import React from 'react';
import {HeaderProps} from './ChatBuilder';

const ChatHeader = ({config}: HeaderProps) => {
  const {title = 'Welcome!', subtitle = 'How can we help you?'} = config;

  return (
    <div
      style={{
        padding: '16px',
        background: 'rgb(24, 144, 255)',
        color: '#fff',
      }}
    >
      <h2 style={{marginTop: 4, marginBottom: 8}}>{title}</h2>
      <p style={{margin: 0}}>{subtitle}</p>
    </div>
  );
};

export default ChatHeader;
