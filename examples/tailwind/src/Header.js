import React from 'react';

const Header = ({config}) => {
  const {title = 'Welcome!', subtitle = 'How can we help you?'} = config;

  return (
    <div className='p-4 bg-blue-500'>
      <h2 className='text-2xl font-medium text-white mb-2'>{title}</h2>
      <p className='text-white'>{subtitle}</p>
    </div>
  );
};

export default Header;
