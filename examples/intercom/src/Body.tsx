import React from 'react';
import styled from '@emotion/styled';
import {BodyProps} from '@papercups-io/chat-builder';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const Box = styled.div(({children, theme, ...props}: any) => {
  return {...props};
});

const Flex = styled.div(({children, theme, ...props}: any) => {
  return {...props, display: 'flex'};
});

const BodyContainer = styled(Box)`
  position: relative;
  flex: 1 1 0%;
  height: 100%;
  background-color: white;
  box-shadow: rgb(0 0 0 / 20%) 0px 21px 4px -20px inset;
  padding: 24px 24px 0px;
`;

const groupMessagesByDate = (messages: Array<any>) => {
  return messages.reduce((acc, message, idx) => {
    const next = messages[idx + 1] || null;
    const date =
      message.type === 'bot' && next ? next.created_at : message.created_at;
    const formatted = dayjs.utc(date).local().format('MMMM DD');

    return {...acc, [formatted]: (acc[formatted] || []).concat(message)};
  }, {});
};

const CustomerMessage = ({message, isNextSameSender}: any) => {
  const isSending = !message.created_at;

  return (
    <Flex
      style={{
        paddingBottom: isNextSameSender ? 8 : 16,
        paddingLeft: 48,
        paddingRight: 0,
        justifyContent: 'flex-end',
        // TODO: come up with a better UI for "sending" state
        opacity: isSending ? 0.6 : 1,
      }}
    >
      <Box
        style={{
          fontSize: 14,
          borderRadius: 5,
          padding: '16px 20px',
          background: 'rgb(24, 144, 255)',
          color: '#fff',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.body}
      </Box>
    </Flex>
  );
};

const AgentMessage = ({message, isNextSameSender}: any) => {
  const profilePhotoUrl =
    message.user?.profile_photo_url ||
    'https://avatars.slack-edge.com/2021-01-13/1619416452487_002cddd7d8aea1950018_192.png';
  const shouldDisplayAvatar = !isNextSameSender;

  return (
    <Flex
      style={{
        position: 'relative',
        paddingBottom: isNextSameSender ? 8 : 16,
        paddingLeft: 44,
        paddingRight: 48,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      }}
    >
      {shouldDisplayAvatar && (
        <Box
          style={{
            height: 32,
            width: 32,
            position: 'absolute',
            left: 0,
            bottom: 24,

            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',

            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundImage: `url(${profilePhotoUrl})`,
          }}
        />
      )}

      <Box
        style={{
          fontSize: 14,
          borderRadius: 5,
          padding: '16px 20px',
          background: 'rgb(245, 245, 245)',
          color: 'rgba(0,0,0,.65)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.body}
      </Box>
    </Flex>
  );
};

const Body = ({state, scrollToRef}: BodyProps) => {
  const {customerId, messages = []} = state;
  const grouped = groupMessagesByDate(messages);

  return (
    <BodyContainer>
      {Object.keys(grouped).map((date) => {
        const messages = grouped[date];

        return (
          <Box key={date}>
            <Flex
              style={{
                paddingTop: 14,
                paddingBottom: 14,
                fontSize: 14,
                color: 'rgb(115, 115, 118)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {date}
            </Flex>

            {messages.map((message: any, idx: number) => {
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
          </Box>
        );
      })}

      <Box key='scroll-el' ref={scrollToRef} />
    </BodyContainer>
  );
};

export default Body;
