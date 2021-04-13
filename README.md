# @papercups-io/chat-builder

> Papercups chat builder

[![NPM](https://img.shields.io/npm/v/@papercups-io/chat-builder.svg)](https://www.npmjs.com/package/@papercups-io/chat-builder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# What is it?

`@papercups-io/chat-builder` is a library that allows you to create your own custom chat UI while leveraging the power of Papercups.

## Try it out

- [CodePen](https://codepen.io/reichertjalex/pen/GRNLLvG?editors=0010)
- [CodeSandbox](https://codesandbox.io/s/papercups-custom-chat-builder-j2hzj?file=/src/App.js)
- [StackBlitz](https://stackblitz.com/edit/papercups-custom-chat-builder?file=src/App.js)

## Demo

Example of an imitation of Intercom's design using the Papercups `ChatBuilder` component:

<img width="400" alt="Intercom UI example" src="https://user-images.githubusercontent.com/5264279/110964071-c8716980-8320-11eb-8eb7-ec057f998fe7.png">


## Install

```bash
npm install --save @papercups-io/chat-builder
```

## Usage

First, sign up at https://app.papercups.io/register to get your account token. Your account token is what you will use to pass in as the `accountId` below.

To create a custom chat UI within the skeleton of a standard chat widget, you can use the `header`, `body`, `footer`, `toggle`, and `notifications` props to render custom React components:

```tsx
import React from 'react';
import {ChatBuilder} from '@papercups-io/chat-builder';

const Example = () => {
  const config = {
    // Put your personal account ID here
    accountId: '__MY_ACCOUNT_ID__',
    // Use a `greeting` to set the initial message in the chat
    greeting: 'Welcome to my website! Ask me anything below :)',
    // Provide some metadata about the person you're chatting with (if available)
    customer: {
      name: 'Demo User',
      // Ad hoc metadata
      metadata: {
        page: 'github',
      },
    },
  };

  return (
    <ChatBuilder
      config={config}
      header={({config, state, onClose}) => {
        return <Header {...} />;
      }}
      body={({config, state, scrollToRef}) => {
        return <Body {...} />;
      }}
      footer={({config, state, onSendMessage}) => {
        return <Footer {...} />;
      }}
      toggle={({state, onToggleOpen}) => {
        return <Toggle {...} />;
      }}
    />
  );
};
```

To create a completely custom UI from scratch, pass in your custom chat component as `children` like so:

```tsx
import React from 'react';
import {ChatBuilder} from '@papercups-io/chat-builder';

const Example = () => {
  const config = {
    // Put your personal account ID here
    accountId: '__MY_ACCOUNT_ID__',
    // Use a `greeting` to set the initial message in the chat
    greeting: 'Welcome to my website! Ask me anything below :)',
    // Provide some metadata about the person you're chatting with (if available)
    customer: {
      name: 'Demo User',
      // Ad hoc metadata
      metadata: {
        page: 'github',
      },
    },
  };

  return (
    <ChatBuilder
      config={config}
      // Optional callbacks
      onChatLoaded={() => console.log('Chat loaded!')}
      onChatClosed={() => console.log('Chat closed!')}
      onChatOpened={() => console.log('Chat opened!')}
      onMessageReceived={(message) => console.log('Message received!', message)}
      onMessageSent={(message) => console.log('Message sent!', message)}
    >
      {({config, state, onClose, onSendMessage, onToggleOpen, scrollToRef}) => {
        return (
          <MyCustomChat
            config={config}
            state={state}
            onClose={onClose}
            onSendMessage={onSendMessage}
            onToggleOpen={onToggleOpen}
            scrollToRef={scrollToRef}
          />
        );
      }}
    </ChatBuilder>
  );
};
```

## Live demo

To see an example of a completely custom chat UI built with `@papercups-io/chat-builder` and TailwindCSS, visit https://papercups-io.github.io/chat-builder/

The code can be found here: https://github.com/papercups-io/chat-builder/blob/master/examples/tailwind/src/App.js

## Questions?

If you're having any trouble getting started or just want to say hi, join us on [Slack](https://join.slack.com/t/papercups-io/shared_invite/zt-h0c3fxmd-hZi1Zp8~D61S6GD16aMqmg)! :wave:

### Submitting a PR

We welcome any contributions! Please create an issue before submitting a pull request.

When creating a pull request, be sure to include a screenshot! 🎨

## License

MIT © Papercups
