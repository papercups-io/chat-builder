import React from 'react';
import styled from '@emotion/styled';

const Box = styled.div(({children, theme, ...props}: any) => {
  return {...props};
});

const FooterWrapper = styled(Box)`
  min-height: 56px;
  max-height: 200px;
  position: relative;
  border-top: 1px solid rgb(230, 230, 230);
`;

const FooterContainer = styled(Box)`
  position: absolute;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
`;

const FooterTextarea = styled.textarea`
  box-sizing: border-box;
  padding: 18px 100px 18px 29px;
  width: 100%;
  height: 100%;
  font-family: 'Open Sans', 'Helvetica Neue', 'Apple Color Emoji', Helvetica,
    Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.33;
  background-color: rgb(255, 255, 255);
  white-space: pre-wrap;
  overflow-wrap: break-word;

  position: absolute;
  bottom: 0px;
  left: 0px;
  color: rgb(0, 0, 0);
  resize: none;
  border: none;
  transition: background-color 200ms ease 0s, box-shadow 200ms ease 0s;
  outline-offset: -5px;

  outline: none;

  &:focus {
    outline: none;
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 100px 0px;
  }
`;

const EmojiSvg = () => {
  return (
    <svg
      style={{height: 18, top: 18, position: 'absolute', fill: 'currentcolor'}}
      focusable='false'
      aria-hidden='true'
      viewBox='0 0 18 18'
    >
      <path
        d='M9 0a9 9 0 1 1 0 18A9 9 0 0 1 9 0zm0 1C4.589 1 1 4.589 1 9s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM5 6.999a1 1 0 1 1 2.002.004A1 1 0 0 1 5 6.999zm5.999 0a1.002 1.002 0 0 1 2.001 0 1 1 0 1 1-2.001 0zM8.959 13.5c-.086 0-.173-.002-.26-.007-2.44-.132-4.024-2.099-4.09-2.182l-.31-.392.781-.62.312.39c.014.017 1.382 1.703 3.37 1.806 1.306.072 2.61-.554 3.882-1.846l.351-.356.712.702-.35.356c-1.407 1.427-2.886 2.15-4.398 2.15z'
        fillRule='evenodd'
      ></path>
    </svg>
  );
};

const FileSvg = () => {
  return (
    <svg
      style={{height: 18, top: 18, position: 'absolute', fill: 'currentcolor'}}
      focusable='false'
      aria-hidden='true'
      viewBox='0 0 16 18'
    >
      <path
        d='M14.154 6.918l-.004.003.001-.004-3.287 3.286-.006-.005-3.574 3.574c-.016.017-.03.036-.048.053l-.05.047-.043.041v-.002c-1.167 1.07-2.692 1.331-3.823.2-1.13-1.13-.89-2.677.18-3.843l-.005-.004.074-.073.016-.018c.006-.005.012-.009.017-.016l6.053-6.053.761.76-6.053 6.054-.029.028v.001l-.005.004-.073.074c.011-.01.025-.018.035-.03-.688.75-.93 1.636-.21 2.356.72.72 1.583.456 2.333-.232l-.03.034.04-.042.01-.008.008-.009.033-.03.031-.034.01-.009.007-.009 5.004-5.003.005.006 1.858-1.859c1.223-1.218 1.51-2.913.291-4.132C12.462.806 10.414.74 9.195 1.958L2.248 8.905c.003 0 .006-.002.008-.004-1.625 1.667-1.542 4.43.103 6.074 1.646 1.646 4.474 1.795 6.141.17-.003.002-.004.008-.008.012l.047-.047 6.053-6.054.042-.042.743.78-.025.021.001.002-6.05 6.05-.002.002-.002.001-.046.046h-.002c-2.094 2.04-5.578 1.894-7.652-.18-2.049-2.049-2.15-5.407-.183-7.505l-.006-.005h-.002l.076-.078 6.943-6.944.003-.002.004-.005c1.641-1.64 4.367-1.574 6.008.066 1.64 1.642 1.353 4.014-.288 5.655z'
        fillRule='evenodd'
      ></path>
    </svg>
  );
};

const FooterButtonsContainer = styled(Box)`
  position: absolute;
  top: 0px;
  right: 21px;
`;

const FooterButton = styled.button`
  margin: 0px;
  padding: 0px;
  background-color: transparent;
  background-image: none;
  border: none;
  border-radius: 0px;
  box-sizing: content-box;
  min-width: 0px;
  position: relative;
  float: left;
  display: inline-block;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 200ms ease 0s;
  height: 51px;
  margin-top: 2px;
  padding-left: 8px;
  padding-right: 8px;

  &:focus {
    outline: none;
  }
`;

const Footer = ({onSendMessage}: any) => {
  const [message, setMessageBody] = React.useState('');

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessageBody(e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSendMessage({body: message});
      setMessageBody('');
    }
  };

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterTextarea
          placeholder='Send a message...'
          value={message}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
        />
        <FooterButtonsContainer>
          <FooterButton style={{width: 18}}>
            <EmojiSvg />
          </FooterButton>
          <FooterButton style={{width: 18}}>
            <FileSvg />
          </FooterButton>
        </FooterButtonsContainer>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
