import React from 'react';

const CustomerMessage = ({message}) => {
  return (
    <div className={`flex my-2 justify-end`}>
      <div
        style={{maxWidth: '80%'}}
        className={`rounded py-2 px-3 text-white bg-blue-500`}
      >
        {message.body}
      </div>
    </div>
  );
};

const AgentMessage = ({message}) => {
  const {user = {}} = message;
  const {display_name, full_name, profile_photo_url} = user;
  const name = display_name || full_name || 'A';
  const photoUrl = profile_photo_url || null;

  return (
    <div className={`flex my-2 justify-start items-center `}>
      {photoUrl && photoUrl.length ? (
        <div
          className='flex w-8 h-8 justify-center items-center mr-2 rounded-full'
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundImage: `url(${photoUrl})`,
          }}
        ></div>
      ) : (
        <div className='flex w-8 h-8 justify-center items-center mr-2 rounded-full text-white bg-blue-500'>
          {name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div
        style={{maxWidth: '80%'}}
        className={`rounded py-2 px-3 bg-gray-100 dark:bg-gray-700 dark:text-white`}
      >
        {message.body}
      </div>
    </div>
  );
};

const Body = ({state, scrollToRef}) => {
  const {customerId, messages = []} = state;

  return (
    <div className='pt-3'>
      {messages.map((message, idx) => {
        const key = message.id || idx;
        const isMe =
          message.customer_id === customerId ||
          (!!message.sent_at && message.type === 'customer');

        return isMe ? (
          <CustomerMessage key={key} message={message} />
        ) : (
          <AgentMessage key={key} message={message} />
        );
      })}

      <div key='scroll-el' ref={scrollToRef} />
    </div>
  );
};

export default Body;
