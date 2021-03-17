import React from 'react';
import {BodyProps} from './ChatBuilder';

const ChatBody = ({state, scrollToRef}: BodyProps) => {
  const {customerId, messages = []} = state;

  return (
    <div style={{padding: 8}}>
      {messages.map((message: any, idx: number) => {
        const isMe =
          message.customer_id === customerId ||
          (!!message.sent_at && message.type === 'customer');

        return (
          <div
            key={message.id || idx}
            style={{
              display: 'flex',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
              margin: 8,
            }}
          >
            <div
              style={{
                borderRadius: 4,
                padding: 8,
                background: isMe ? 'rgb(24, 144, 255)' : 'rgb(245, 245, 245)',
                color: isMe ? '#fff' : 'rgba(0,0,0,.65)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.body}
            </div>
          </div>
        );
      })}

      <div key='scroll-el' ref={scrollToRef} />
    </div>
  );
};

export default ChatBody;
