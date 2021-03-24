import React from 'react';
import Box from './Box';

const Header = () => {
  return (
    <Box>
      <p className='nes-text' style={{marginBottom: '0.5rem'}}>
        Welcome to <span className='nes-text is-primary'>Papercups!</span>
      </p>
      <div>
        <span>Ask us anything in the chat below.</span>
      </div>
    </Box>
  );
};

export default Header;
