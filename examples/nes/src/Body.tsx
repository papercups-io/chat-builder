import React from 'react';
import {State, Message, ScrollToRef} from '@papercups-io/chat-builder';

const CompanyMessage = ({message}: {message: string}) => {
  return (
    <section
      className='message'
      style={{width: '85%', display: 'flex', alignItems: 'center'}}
    >
      <i
        className='nes-bcrikko'
        style={{marginRight: '10px', flex: '0 0 96px'}}
      />
      <div className='nes-balloon from-left is-dark'>
        <p>{message}</p>
      </div>
    </section>
  );
};

const CustomerMessage = ({message}: {message: string}) => {
  return (
    <section
      className='message'
      style={{
        width: '65%',
        alignSelf: 'flex-end',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div className='nes-balloon from-right is-dark'>
        <p className='nes-text is-primary'>{message}</p>
      </div>
    </section>
  );
};

const Body = ({
  state,
  scrollToRef,
}: {
  state: State;
  scrollToRef: ScrollToRef;
}) => {
  const {customerId, messages = []} = state;

  return (
    <section
      style={{display: 'flex', flexDirection: 'column'}}
      className='message-list'
    >
      {messages.map((message: Message, idx: number) => {
        const isMe =
          message.customer_id === customerId ||
          (!!message.sent_at && message.type === 'customer');
        const messageKey = message.id || idx;

        if (isMe) {
          return (
            <CustomerMessage key={messageKey} message={message.body || ''} />
          );
        } else {
          return (
            <CompanyMessage key={messageKey} message={message.body || ''} />
          );
        }
      })}

      <div key='scroll-el' ref={scrollToRef} />
    </section>
  );
};

export default Body;
