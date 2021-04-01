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
      <h2
        style={{
          marginTop: 4,
          marginBottom: 4,
          fontWeight: 500,
          color: 'rgb(255, 255, 255)',
        }}
      >
        {title}
      </h2>
      <p style={{margin: 0, color: 'rgba(255, 255, 255, 0.8)'}}>{subtitle}</p>
    </div>
  );
};

export default ChatHeader;
