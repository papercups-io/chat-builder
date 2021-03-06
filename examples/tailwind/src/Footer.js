import React from 'react';

const Footer = ({message, onChange, onSubmit}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit();
  };

  return (
    <div className='p-2 rounded-xl shadow-md border'>
      <form onSubmit={handleSubmit}>
        <input
          style={{
            border: 'none',
            boxSizing: 'border-box',
            width: '100%',
            padding: 8,
            outline: 0,
            fontSize: '1em',
          }}
          value={message}
          placeholder='Start typing...'
          onChange={onChange}
        />
      </form>
    </div>
  );
};

export default Footer;
