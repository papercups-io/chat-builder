import React from 'react';
import {ChatBuilder} from '@papercups-io/chat-builder';
import Header from './Header';
import styled from '@emotion/styled';
import Body from './Body';
import Box from './Box';
import Footer from './Footer';
import ToggleButton from './ToggleButton';

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
      page: 'nes',
    },
  },
  // NB: we override these values during development if we want to test against our local server
  // baseUrl: 'http://localhost:4000',
  // For the demo, we just point at our demo staging environment
  baseUrl: 'https://alex-papercups-staging.herokuapp.com',
};

const ChatInternalContainer = styled.div`
  background-clip: padding-box;
  border-image-outset: 2;
  border-image-repeat: stretch;
  border-image-slice: 2;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-width: 2;
  border-style: solid;
  border-width: 4px;
  height: calc(100% - 8px);
  margin: 4px;
  padding: 0.5rem;
  width: calc(100% - 8px);
  display: flex;
  flex-direction: column;
`;

const ChatWindowContainer = styled.div(({isOpen}: {isOpen?: boolean}) => ({
  backgroundColor: '#fff',
  border: 'none',
  bottom: 100,
  height: isOpen ? 'calc(100% - 120px)' : 0,
  margin: 0,
  maxHeight: ['60%', '704px'],
  maxWidth: ['90%', '640px'],
  minHeight: isOpen ? 250 : 0,
  opacity: isOpen ? 1 : 0,
  overflow: 'hidden',
  pointerEvents: isOpen ? 'auto' : 'none',
  position: 'fixed',
  right: 20,
  transform: isOpen ? 'none' : 'translateY(4px) translateZ(0px)',
  width: 640,
  zIndex: 2147483000,
}));

const App = () => {
  return (
    <div>
      <ChatBuilder config={config}>
        {({config, state, onSendMessage, onToggleOpen, scrollToRef}) => {
          return (
            <React.Fragment>
              <ChatWindowContainer isOpen={state.isOpen}>
                <ChatInternalContainer>
                  <Header />
                  <Box
                    style={{
                      marginTop: '15px',
                      marginBottom: '15px',
                      flexGrow: 1,
                      overflowY: 'scroll',
                      padding: '1rem',
                    }}
                  >
                    <Body state={state} scrollToRef={scrollToRef} />
                  </Box>
                  <Box style={{padding: '0'}}>
                    <Footer config={config} onSendMessage={onSendMessage} />
                  </Box>
                </ChatInternalContainer>
              </ChatWindowContainer>
              <ToggleButton state={state} onToggleOpen={onToggleOpen} />
            </React.Fragment>
          );
        }}
      </ChatBuilder>
    </div>
  );
};

export default App;
