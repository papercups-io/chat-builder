import React from 'react';
import {
  ChatBuilder,
  ChatHeader,
  ChatBody,
  ChatFooter,
  ChatToggle,
} from '@papercups-io/chat-builder';

// NB: during development, replace this with a valid account ID from your dev db
// const TEST_ACCOUNT_ID = 'eb504736-0f20-4978-98ff-1a82ae60b266';
const TEST_ACCOUNT_ID = '2ebbad4c-b162-4ed2-aff5-eaf9ebf469a5';

const config = {
  title: 'Welcome to Papercups!',
  subtitle: 'Ask us anything in the chat window 😊',
  primaryColor: '#1890ff',
  accountId: TEST_ACCOUNT_ID,
  greeting: 'Hi there! How can I help you?',
  newMessagePlaceholder: 'Start typing...',
  emailInputPlaceholder: 'What is your email address?',
  newMessagesNotificationText: 'View new messages',
  agentAvailableText: 'Agents are online!',
  agentUnavailableText: 'Agents are not available at the moment.',
  customer: {
    name: 'Test User',
    email: 'test@test.com',
    external_id: '123',
    // Ad hoc metadata
    metadata: {
      plan: 'starter',
      registered_at: '2020-09-01',
      age: 25,
      valid: true,
    },
  },
  // NB: we override these values during development -- note that the
  // API runs on port 4000 by default, and the iframe on 8080
  baseUrl: 'http://localhost:4000',
  // iframeUrlOverride='http://localhost:8080'
  requireEmailUpfront: true,
  showAgentAvailability: true,
  hideToggleButton: false,
  defaultIsOpen: false,
  iconVariant: 'filled',
  onChatLoaded: () => console.log('Chat loaded!'),
  onChatClosed: () => console.log('Chat closed!'),
  onChatOpened: () => console.log('Chat opened!'),
  onMessageReceived: (message: any) =>
    console.log('Message received!', message),
  onMessageSent: (message: any) => console.log('Message sent!', message),
  setDefaultGreeting: (settings: any) => {
    const shouldDisplayAwayMessage =
      settings?.account?.is_outside_working_hours || false;

    return shouldDisplayAwayMessage
      ? "We're away at the moment, but we'll be back on Monday!"
      : 'Hi there! How can I help you?';
  },
};

const AppV2 = () => {
  return (
    <ChatBuilder config={config}>
      {({config, state, onClose, onSendMessage, onToggleOpen, scrollToRef}) => {
        console.log({
          config,
          state,
          onClose,
          onSendMessage,
          onToggleOpen,
          scrollToRef,
        });

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 640,
              maxWidth: 480,
              margin: 16,
            }}
          >
            {/* <ChatHeader config={config} state={state} onClose={onClose} /> */}
            <div style={{flex: 1, height: '100%', overflow: 'scroll'}}>
              <ChatBody
                config={config}
                state={state}
                scrollToRef={scrollToRef}
              />
            </div>
            <ChatFooter
              config={config}
              state={state}
              onSendMessage={onSendMessage}
            />
          </div>
        );
      }}
    </ChatBuilder>
  );
};

const App = () => {
  return (
    <div>
      {/* {Array.from({length: 20}).map((_, i) => {
        return (
          <p key={i}>
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
            ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
            egestas semper. Aenean ultricies mi vitae est. Mauris placerat
            eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
            Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit
            amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros
            ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim
            in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id
            cursus faucibus, tortor neque egestas augue, eu vulputate magna eros
            eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan
            porttitor, facilisis luctus, metus
          </p>
        );
      })} */}

      <ChatBuilder
        config={config}
        header={({config, state, onClose}) => {
          return <ChatHeader config={config} state={state} onClose={onClose} />;
        }}
        body={({config, state, scrollToRef}) => {
          return (
            <ChatBody config={config} state={state} scrollToRef={scrollToRef} />
          );
        }}
        footer={({config, state, onSendMessage}) => {
          return (
            <ChatFooter
              config={config}
              state={state}
              onSendMessage={onSendMessage}
            />
          );
        }}
        toggle={({state, onToggleOpen}) => {
          const {isOpen} = state;

          return <ChatToggle isOpen={isOpen} onToggleOpen={onToggleOpen} />;
        }}
        notifications={({unread = []}) => {
          return (
            <div>
              {unread.map((message) => {
                return (
                  <div
                    key={message.id}
                    style={{
                      padding: 16,
                      margin: 8,
                      border: '1px solid rgb(245, 245, 245)',
                      borderRadius: 4,
                      boxShadow: 'rgba(35, 47, 53, 0.09) 0px 2px 8px 0px',
                      maxWidth: '84%',
                    }}
                  >
                    {message.body}
                  </div>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
};

console.log(AppV2);

export default App;
