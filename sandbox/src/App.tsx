import React from 'react';
import {
  ChatBuilder,
  ChatHeader,
  ChatBody,
  ChatFooter,
  ChatToggle,
} from '@papercups-io/chat-builder';

// NB: during development, replace this with a valid account ID from your dev db
const TEST_ACCOUNT_ID = 'eb504736-0f20-4978-98ff-1a82ae60b266';

const App = () => {
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
    // baseUrl: 'http://localhost:4000',
    baseUrl: 'https://alex-papercups-staging.herokuapp.com',
    requireEmailUpfront: true,
    showAgentAvailability: true,
    hideToggleButton: false,
    defaultIsOpen: false,
    iconVariant: 'filled',
  };

  return (
    <div>
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

export default App;
