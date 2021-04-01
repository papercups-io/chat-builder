import React from 'react';
import {BodyProps} from './ChatBuilder';

const CustomerMessage = ({message, isNextSameSender}: any) => {
  return (
    <div
      style={{
        display: 'flex',
        paddingBottom: isNextSameSender ? 8 : 16,
        paddingLeft: 48,
        paddingRight: 0,
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          fontSize: 14,
          borderRadius: 5,
          padding: '12px 16px',
          background: 'rgb(24, 144, 255)',
          color: '#fff',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.body}
      </div>
    </div>
  );
};

const AgentMessage = ({message, isNextSameSender}: any) => {
  const profilePhotoUrl =
    message.user?.profile_photo_url ||
    'https://avatars.slack-edge.com/2021-01-13/1619416452487_002cddd7d8aea1950018_192.png';
  const shouldDisplayAvatar = !isNextSameSender;

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        paddingBottom: isNextSameSender ? 8 : 16,
        paddingLeft: 44,
        paddingRight: 48,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      }}
    >
      {shouldDisplayAvatar && (
        <div
          style={{
            height: 32,
            width: 32,
            position: 'absolute',
            left: 0,
            bottom: 20,

            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',

            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundImage: `url(${profilePhotoUrl})`,
          }}
        />
      )}

      <div
        style={{
          fontSize: 14,
          borderRadius: 5,
          padding: '12px 16px',
          background: 'rgb(245, 245, 245)',
          color: 'rgba(0,0,0,.65)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.body}
      </div>
    </div>
  );
};

const ChatBody = ({state, scrollToRef}: BodyProps) => {
  const {customerId, messages = []} = state;

  return (
    <div style={{padding: '16px 16px 0px'}}>
      {messages.map((message: any, idx: number) => {
        const isCustomer =
          message.customer_id === customerId ||
          (!!message.sent_at && message.type === 'customer');
        const next = messages[idx + 1];
        const isNextMessageCustomer =
          next &&
          (next.customer_id === customerId ||
            (!!next.sent_at && next.type === 'customer'));
        const isNextSameSender = isCustomer === isNextMessageCustomer;

        if (isCustomer) {
          return (
            <CustomerMessage
              key={message.id || idx}
              message={message}
              isNextSameSender={isNextSameSender}
            />
          );
        } else {
          return (
            <AgentMessage
              key={message.id || idx}
              message={message}
              isNextSameSender={isNextSameSender}
            />
          );
        }
      })}

      <div key='scroll-el' ref={scrollToRef} />
    </div>
  );
};

export default ChatBody;
