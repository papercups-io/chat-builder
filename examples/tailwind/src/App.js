import React from 'react';
import {ChatBuilder} from '@papercups-io/chat-builder';

// NB: during development, replace this with a valid account ID from your dev db
const TEST_ACCOUNT_ID = 'eb504736-0f20-4978-98ff-1a82ae60b266';

const config = {
  accountId: TEST_ACCOUNT_ID,
  greeting:
    'Welcome to the Papercups demo! Feel free to send test messages below :)',
  customer: {
    name: 'Demo User',
    // Ad hoc metadata
    metadata: {
      page: 'github',
    },
  },
  // NB: we override these values during development if we want to test against our local server
  // baseUrl: 'http://localhost:4000',
  // For the demo, we just point at our demo staging environment
  baseUrl: 'https://alex-papercups-staging.herokuapp.com',
};

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

const ChatMessages = ({messages = [], customerId, scrollToRef}) => {
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

const Chat = ({config, state, onSendMessage, scrollToRef}) => {
  const [message, setMessageBody] = React.useState('');
  const {messages = [], customerId} = state;

  const handleChangeMessage = (e) => setMessageBody(e.target.value);

  const handleSendMessage = () => {
    onSendMessage({body: message});
    setMessageBody('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div
      className='flex flex-col'
      style={{
        width: 480,
        maxWidth: '100%',
      }}
    >
      <div
        className='flex flex-col border rounded-xl flex-1 mb-6 dark:bg-gray-800'
        style={{height: 560}}
      >
        <div
          className='pt-4 px-4 mb-4'
          style={{
            flex: 1,
            height: '100%',
            overflow: 'scroll',
          }}
        >
          <ChatMessages
            messages={messages}
            customerId={customerId}
            scrollToRef={scrollToRef}
          />
        </div>

        <div className='px-4 pb-4'>
          <div className='p-2 rounded-xl shadow-md border'>
            <form onSubmit={handleSubmit}>
              <input
                className='bg-transparent outline-none box-border w-full p-2 dark:text-white'
                value={message}
                placeholder='Start typing...'
                onChange={handleChangeMessage}
              />
            </form>
          </div>
        </div>
      </div>

      <div className='flex-1'>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full w-full focus:outline-none'
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [isDarkMode, setDarkMode] = React.useState(false);

  const handleToggleMode = (e) => {
    setDarkMode(e.target.checked);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : 'light'} p-6`}>
      <ChatBuilder
        config={config}
        onChatLoaded={() => console.log('Chat loaded!')}
        onChatClosed={() => console.log('Chat closed!')}
        onChatOpened={() => console.log('Chat opened!')}
        onMessageReceived={(message) =>
          console.log('Message received!', message)
        }
        onMessageSent={(message) => console.log('Message sent!', message)}
      >
        {({
          config,
          state,
          onClose,
          onSendMessage,
          onToggleOpen,
          scrollToRef,
        }) => {
          return (
            <Chat
              config={config}
              state={state}
              onClose={onClose}
              onSendMessage={onSendMessage}
              onToggleOpen={onToggleOpen}
              scrollToRef={scrollToRef}
            />
          );
        }}
      </ChatBuilder>

      <div className='mt-10'>
        <label className='inline-flex items-center mt-3'>
          <input
            type='checkbox'
            className='h-5 w-5'
            checked={isDarkMode}
            onChange={handleToggleMode}
          />
          <span className='ml-2 text-gray-700'>Dark mode</span>
        </label>
      </div>
    </div>
  );
};

export default App;
