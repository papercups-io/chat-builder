import React from 'react';
import styled from '@emotion/styled';

const Box = styled.div(({children, theme, ...props}: any) => {
  return {...props};
});

const Flex = styled.div(({children, theme, ...props}: any) => {
  return {...props, display: 'flex'};
});

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, rgb(24, 144, 255) 0%, rgb(0, 0, 0) 100%);
  color: rgb(255, 255, 255);
  padding: 24px 24px 4px 40px;
`;

const HeaderTitle = styled.h2`
  color: rgb(255, 255, 255);
  font-size: 20px;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  font-weight: normal;
`;

const HeaderSubtitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 21px;
`;

const ReplyTimeContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0px 32px;
`;

const ReplyTimeLabel = styled.div`
  font-size: 14px;
  width: 100%;
  -webkit-box-flex: 1;
  flex-grow: 1;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
`;

const ReplyTimeValue = styled(Flex)`
  font-weight: 500;
  font-size: 14px;
  color: rgb(255, 255, 255);
  line-height: 1.5;
`;

const ClockSvg = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='14'
      viewBox='0 0 14 14'
      style={{
        fill: 'currentcolor',
        alignSelf: 'center',
        marginRight: 4,
      }}
    >
      <path
        fillRule='evenodd'
        d='M12.5 7c0 3.0376-2.4624 5.5-5.5 5.5-3.03757 0-5.5-2.4624-5.5-5.5 0-3.03757 2.46243-5.5 5.5-5.5 3.0376 0 5.5 2.46243 5.5 5.5zM14 7c0 3.866-3.134 7-7 7-3.86599 0-7-3.134-7-7 0-3.86599 3.13401-7 7-7 3.866 0 7 3.13401 7 7zM6.27844 3.48219v3.78093l.00105.00104c.00305.07805.03658.1518.09341.20546l.07452.0566L9.6706 9.69708l.15009.03773h.05667c.09341-.01886.14904-.07442.20574-.13102l.4125-.65514c.0355-.04926.0552-.10809.0566-.16876 0-.09329-.0566-.14885-.1501-.20545L7.62817 6.68345V3.48219c0-.14989-.1312-.29979-.30017-.29979h-.74938c-.16898 0-.30018.1499-.30018.29979z'
        clipRule='evenodd'
      ></path>
    </svg>
  );
};

const Header = ({config}: any) => {
  const {title, subtitle} = config;

  return (
    <HeaderContainer>
      <HeaderTitle>{title}</HeaderTitle>
      <HeaderSubtitle>{subtitle}</HeaderSubtitle>
      <ReplyTimeContainer>
        <Box
          style={{
            height: 56,
            width: 56,
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: 8,
          }}
        >
          <img
            style={{height: '100%'}}
            alt='Alex'
            src='https://i.imgur.com/dNy8biD.jpg'
          />
        </Box>
        <Box style={{marginLeft: 8}}>
          <ReplyTimeLabel>Our usual reply time</ReplyTimeLabel>
          <ReplyTimeValue alignItems='center'>
            <ClockSvg /> A few minutes
          </ReplyTimeValue>
        </Box>
      </ReplyTimeContainer>
    </HeaderContainer>
  );
};

export default Header;
