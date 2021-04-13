import React from 'react';
import {ChatBuilder} from '@papercups-io/chat-builder';
import {Input, Typography} from '@supabase/ui';

// NB: during development, replace this with a valid account ID from your dev db
const TEST_ACCOUNT_ID = 'eb504736-0f20-4978-98ff-1a82ae60b266';

const config = {
  accountId: TEST_ACCOUNT_ID,
  greeting:
    'Welcome to the Papercups/Supabase UI demo! Feel free to send test messages below :)',
  customer: {
    name: 'Demo User',
    // Ad hoc metadata
    metadata: {
      page: 'supabase',
    },
  },
  // For the demo, we just point at our demo staging environment
  baseUrl: 'https://alex-papercups-staging.herokuapp.com',
};

const SUPABASE_GREEN = 'rgb(36,180,126)';

const CustomerMessage = ({message, isNextSameSender}) => {
  return (
    <div className={`flex justify-end ${isNextSameSender ? 'mb-2' : 'mb-3'}`}>
      <div
        style={{maxWidth: '80%', background: SUPABASE_GREEN}}
        className={`rounded py-2 px-3 text-white`}
      >
        <Typography.Text style={{color: '#fff'}}>
          {message.body}
        </Typography.Text>
      </div>
    </div>
  );
};

const AgentMessage = ({message, isNextSameSender}) => {
  const {user = {}} = message;
  const {display_name, full_name, profile_photo_url} = user;
  const name = display_name || full_name || 'Alex';
  const photoUrl =
    profile_photo_url ||
    'https://avatars.githubusercontent.com/u/54469796?s=200&v=4';

  return (
    <div
      className={`flex justify-start items-center ${
        isNextSameSender ? 'mb-2' : 'mb-3'
      }`}
    >
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
        <div
          style={{background: SUPABASE_GREEN}}
          className='flex w-8 h-8 justify-center items-center mr-2 rounded-full'
        >
          <Typography.Text style={{color: '#fff'}}>
            {name.slice(0, 1).toUpperCase()}
          </Typography.Text>
        </div>
      )}
      <div
        style={{maxWidth: '80%'}}
        className={`rounded py-2 px-3 bg-gray-100 dark:bg-gray-500 dark:text-white`}
      >
        <Typography.Text>{message.body}</Typography.Text>
      </div>
    </div>
  );
};

const ChatMessages = ({messages = [], customerId, scrollToRef}) => {
  return (
    <div>
      {messages.map((message, idx) => {
        const key = message.id || idx;
        // TODO: clean/DRY up a bit?
        const isCustomer =
          message.customer_id === customerId ||
          (!!message.sent_at && message.type === 'customer');
        const next = messages[idx + 1];
        const isNextMessageCustomer =
          next &&
          (next.customer_id === customerId ||
            (!!next.sent_at && next.type === 'customer'));
        const isNextSameSender = isCustomer === isNextMessageCustomer;

        return isCustomer ? (
          <CustomerMessage
            key={key}
            message={message}
            isNextSameSender={isNextSameSender}
          />
        ) : (
          <AgentMessage
            key={key}
            message={message}
            isNextSameSender={isNextSameSender}
          />
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
        height: 560,
        width: 400,
        maxWidth: '100%',
      }}
    >
      <div className='flex flex-col border border-gray-300 rounded-md flex-1 max-h-full dark:bg-gray-600'>
        <div
          className='pt-3 px-3 mb-3'
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

        <div className='px-3 pb-3'>
          <form onSubmit={handleSubmit}>
            <Input
              value={message}
              placeholder='Start typing...'
              onChange={handleChangeMessage}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  console.log('Initializing Supabase/Papercups example...');

  const [isDarkMode, setDarkMode] = React.useState(true);

  const handleToggleMode = (e) => {
    const [html] = document.getElementsByTagName('html');
    const {className = ''} = html;
    const isCurrentlyDark = className.indexOf('dark') !== -1;

    if (isCurrentlyDark) {
      html.className = className
        .split(' ')
        .filter((cl) => cl !== 'dark')
        .join(' ');

      setDarkMode(false);
    } else {
      html.className = [className, 'dark'].join(' ');

      setDarkMode(true);
    }
  };

  return (
    <div className={`p-6`}>
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
          <span className='ml-2 text-gray-700 dark:text-white'>Dark mode</span>
        </label>
      </div>
    </div>
  );
};

export default App;
