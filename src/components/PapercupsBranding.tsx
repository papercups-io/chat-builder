import React from 'react';

const PapercupsBranding = () => {
  return (
    <div
      style={{
        display: 'flex',
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <a
        href='https://papercups.io?utm_source=papercups&utm_medium=chat&utm_campaign=chat-builder-link'
        target='_blank'
        rel='noopener noreferrer'
        style={{
          color: 'gray',
          opacity: 0.8,
          transition: '0.2s',
        }}
      >
        Powered by Papercups
      </a>
    </div>
  );
};

export default PapercupsBranding;
