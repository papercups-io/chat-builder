import React from 'react';
import {Config, OnSendMessage} from '@papercups-io/chat-builder';

const Footer = ({
  config,
  onSendMessage,
}: {
  config: Config;
  onSendMessage: OnSendMessage;
}) => {
  const [body, setMessageBody] = React.useState('');

  const handleChange = (e: any) => setMessageBody(e.target.value);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSendMessage({body});
    setMessageBody('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type='text'
          className='nes-input is-dark footer-input'
          value={body}
          placeholder={config.newMessagePlaceholder || 'Start typing...'}
          onChange={handleChange}
          style={{border: 'none'}}
        />
      </div>
    </form>
  );
};

export default Footer;
