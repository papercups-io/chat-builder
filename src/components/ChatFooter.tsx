import React from 'react';
import {FooterProps} from './ChatBuilder';

const ChatFooter = ({config, onSendMessage}: FooterProps) => {
  const [body, setMessageBody] = React.useState('');
  const {newMessagePlaceholder = 'Start typing...'} = config;

  const handleChange = (e: any) => setMessageBody(e.target.value);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSendMessage({body});
    setMessageBody('');
  };

  return (
    <div
      style={{
        padding: 8,
        borderTop: '1px solid rgb(230, 230, 230)',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 100px 0px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          style={{
            border: 'none',
            boxSizing: 'border-box',
            width: '100%',
            padding: 8,
            outline: 0,
            fontSize: '1em',
          }}
          value={body}
          placeholder={newMessagePlaceholder}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default ChatFooter;
