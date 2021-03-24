import React from 'react';
import {State} from '@papercups-io/chat-builder';

const ToggleButton = ({
  state,
  onToggleOpen,
}: {
  state: State;
  onToggleOpen: () => void;
}) => {
  return (
    <div
      style={{position: 'fixed', bottom: '30px', right: '20px'}}
      onClick={onToggleOpen}
    >
      <button id='toggle-btn' type='button' className='nes-btn is-primary'>
        <span>{state.isOpen ? 'X' : 'Chat'}</span>
      </button>
    </div>
  );
};

export default ToggleButton;
