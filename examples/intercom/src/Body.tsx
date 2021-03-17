import React from 'react';
import styled from '@emotion/styled';

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

const Body = ({state, scrollToRef}: any) => {
  const {customerId, messages = []} = state;

  return (
    <BodyContainer>
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

        return (
          <Flex
            key={message.id || idx}
            style={{
              paddingBottom: isNextSameSender ? 8 : 16,
              paddingLeft: isCustomer ? 48 : 16,
              paddingRight: isCustomer ? 0 : 48,
              justifyContent: isCustomer ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                fontSize: 14,
                borderRadius: 5,
                padding: '16px 20px',
                background: isCustomer
                  ? 'rgb(24, 144, 255)'
                  : 'rgb(245, 245, 245)',
                color: isCustomer ? '#fff' : 'rgba(0,0,0,.65)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.body}
            </div>
          </Flex>
        );
      })}

      <div key='scroll-el' ref={scrollToRef} />
    </BodyContainer>
  );
};

export default Body;
