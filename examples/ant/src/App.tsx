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
      />
    </div>
  );
};

export default App;
