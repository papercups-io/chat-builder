import React from 'react';
import {Presence} from 'phoenix';
import styled from '@emotion/styled';
import PapercupsBranding from './PapercupsBranding';
import {
  noop,
  areDatesEqual,
  isCustomerMessage,
  shorten,
  setupCustomEventHandlers,
} from '../helpers/utils';
import {CustomerMetadata, Message, WidgetConfig} from '../helpers/types';
import {isDev} from '../helpers/config';
import Logger from '../helpers/logger';
import {
  addVisibilityEventListener,
  isWindowHidden,
} from '../helpers/visibility';
import {getUserInfo} from '../track/info';
import {Papercups} from '../core/papercups';

const Box = styled.div``;

const Flex = styled.div`
  display: flex;
`;

const ChatWindowContainer = styled.div(({isOpen}: {isOpen?: boolean}) => ({
  margin: 0,
  zIndex: 2147483000,
  position: 'fixed',
  bottom: 100,
  right: 20,
  width: 376,
  maxWidth: ['90%', '376px'],
  minHeight: isOpen ? 250 : 0,
  maxHeight: ['60%', '704px'],
  background: '#fff',
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 5px 40px',
  height: isOpen ? 'calc(100% - 120px)' : 0,
  border: 'none',
  borderRadius: 8,
  overflow: 'hidden',
  transition: 'opacity 0.2s ease-in, transform 0.2s ease-in',
  opacity: isOpen ? 1 : 0,
  transform: isOpen ? 'none' : 'translateY(4px) translateZ(0px)',
  pointerEvents: isOpen ? 'auto' : 'none',
}));

const NotificationsContainer = styled.div(({isOpen}: {isOpen?: boolean}) => ({
  margin: 0,
  zIndex: 2147483000,
  position: 'fixed',
  bottom: 100,
  right: 20,
  width: 240,
  maxWidth: ['90%', '376px'],
  minHeight: isOpen ? 250 : 0,
  maxHeight: ['60%', '704px'],
  background: 'transparent',
  boxShadow: 'none',
  height: isOpen ? 'calc(100% - 120px)' : 0,
  border: 'none',
  borderRadius: 8,
  overflow: 'hidden',
  transition: 'opacity 0.2s ease-in, transform 0.2s ease-in',
  opacity: isOpen ? 1 : 0,
  transform: isOpen ? 'none' : 'translateY(4px) translateZ(0px)',
  pointerEvents: isOpen ? 'auto' : 'none',
}));

const ToggleButtonContainer = styled.div({
  position: 'fixed',
  zIndex: 2147483003,
  bottom: 20,
  right: 20,
});

export type Config = {
  accountId: string;
  customerId?: string;
  primaryColor?: string;
  title?: string;
  subtitle?: string;
  baseUrl?: string;
  greeting?: string;
  newMessagePlaceholder?: string;
  emailInputPlaceholder?: string;
  newMessagesNotificationText?: string;
  shouldRequireEmail?: boolean;
  isMobile?: boolean;
  customer?: CustomerMetadata;
  companyName?: string;
  agentAvailableText?: string;
  agentUnavailableText?: string;
  showAgentAvailability?: boolean;
  isCloseable?: boolean;
};

export interface Options {
  config: Config;
  state: State;
}

export type OnSendMessage = (
  message: Partial<Message>,
  email?: string
) => Promise<any>;
export type ScrollToRef = (el: any) => void;
export type HeaderProps = Options & {onClose: () => void};
export type BodyProps = Options & {scrollToRef: ScrollToRef};
export type FooterProps = Options & {
  onSendMessage: OnSendMessage;
};
export type ToggleButtonProps = Options & {onToggleOpen: () => void};
export type NotificationsProps = Options & {
  unread: Array<Message>;
  onToggleOpen: () => void;
};

export type ChildrenProps = Options & {
  onClose: () => void;
  onSendMessage: OnSendMessage;
  onToggleOpen: () => void;
  scrollToRef: ScrollToRef;
};

type Props = {
  config: Config;
  debug?: boolean;
  isOpenByDefault?: boolean;
  styles?: {
    header?: Record<string, any>;
    body?: Record<string, any>;
    footer?: Record<string, any>;
  };
  // TODO: figure out what type this should be
  children?: (options: ChildrenProps) => React.ReactElement;
  // UI components
  header?: (options: HeaderProps) => React.ReactElement;
  body?: (options: BodyProps) => React.ReactElement;
  footer?: (options: FooterProps) => React.ReactElement;
  toggle?: (options: ToggleButtonProps) => React.ReactElement;
  notifications?: (options: NotificationsProps) => React.ReactElement;
  // callbacks
  onChatLoaded?: () => void;
  onChatOpened?: () => void;
  onChatClosed?: () => void;
  onMessageSent?: (message: Message) => void;
  onMessageReceived?: (message: Message) => void;
};

export type State = {
  config: WidgetConfig;
  messages: Array<Message>;
  customerId?: string | null;
  conversationId: string | null;
  availableAgents: Array<any>;
  isLoaded: boolean;
  isSending: boolean;
  isOpen: boolean;
  shouldDisplayNotifications: boolean;
  shouldDisplayBranding: boolean;
};

class ChatBuilder extends React.Component<Props, State> {
  scrollToEl: any = null;

  logger: Logger;
  subscriptions: Array<() => void> = [];

  papercups: Papercups;

  EVENTS = [
    'papercups:open',
    'papercups:close',
    'papercups:toggle',
    'papercups:identify',
    'storytime:customer:set',
  ];

  constructor(props: Props) {
    super(props);

    const {children, isOpenByDefault} = props;
    const isOpen = typeof children === 'function' || !!isOpenByDefault;

    this.state = {
      config: {} as WidgetConfig,
      messages: [],
      // TODO: figure out how to determine these, either by IP or localStorage
      // (eventually we will probably use cookies for this)
      // TODO: remove this from state if possible, just use props instead?
      customerId: null,
      availableAgents: [],
      conversationId: null,
      isLoaded: false,
      isSending: false,
      isOpen: isOpen,
      shouldDisplayNotifications: false,
      shouldDisplayBranding: true,
    };
  }

  async componentDidMount() {
    const win = window as any;
    const doc = (document || win.document) as any;
    const debugModeEnabled = isDev(win) || !!this.props.debug;

    this.papercups = Papercups.init({
      customerId: this.props.config.customerId,
      accountId: this.props.config.accountId,
      baseUrl: this.props.config.baseUrl,
      customer: this.props.config.customer,
      debug: this.props.debug,
      onPresenceSync: this.onPresenceSync,
      onSetCustomerId: this.onSetCustomerId,
      onSetConversationId: (conversationId: string) =>
        console.log('onSetConversationId:', conversationId),
      onMessagesUpdated: (messages: Array<Message>) =>
        console.log('onMessagesUpdated:', messages),
      onConversationCreated: this.onConversationCreated,
      onMessageCreated: this.handleNewMessage,
    });
    this.papercups.connect();

    this.logger = new Logger(debugModeEnabled);
    this.subscriptions = [
      setupCustomEventHandlers(window, this.EVENTS, this.customEventHandlers),
      addVisibilityEventListener(doc, this.handleVisibilityChange),
    ];

    const config = await this.loadWidgetSettings();
    const {customerId: cachedCustomerId, metadata} = config;
    const isValidCustomer = await this.papercups.isValidCustomerId(
      cachedCustomerId
    );
    const customerId = isValidCustomer ? cachedCustomerId : null;

    this.setState({customerId});

    await this.fetchLatestConversation(customerId, metadata);

    this.handleChatLoaded();
  }

  componentWillUnmount() {
    // this.channel && this.channel.leave();
    this.papercups.disconnect();
    this.subscriptions.forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
  }

  async loadWidgetSettings() {
    // TODO: use `subscription_plan` from settings.account to determine
    // whether to display the Papercups branding or not in the chat window
    const settings = await this.papercups.fetchWidgetSettings();
    const {
      accountId,
      primaryColor,
      baseUrl,
      title,
      subtitle,
      greeting,
      newMessagePlaceholder,
      emailInputPlaceholder,
      newMessagesNotificationText,
      agentAvailableText,
      agentUnavailableText,
      showAgentAvailability,
      // requireEmailUpfront,
      // canToggle,
      customer = {},
    } = this.props.config;

    const metadata = {...getUserInfo(window), ...customer};
    const config: WidgetConfig = {
      accountId,
      baseUrl,
      agentAvailableText,
      agentUnavailableText,
      title: title || settings.title,
      subtitle: subtitle || settings.subtitle,
      primaryColor: primaryColor || settings.color,
      greeting: greeting || settings.greeting,
      newMessagePlaceholder:
        newMessagePlaceholder || settings.new_message_placeholder,
      emailInputPlaceholder:
        emailInputPlaceholder || settings.email_input_placeholder,
      newMessagesNotificationText:
        newMessagesNotificationText || settings.new_messages_notification_text,
      companyName: settings?.account?.company_name,
      // requireEmailUpfront: requireEmailUpfront ? 1 : 0,
      showAgentAvailability:
        showAgentAvailability || settings.show_agent_availability,
      // closeable: canToggle ? 1 : 0,
      customerId: this.papercups.getCachedCustomerId(),
      subscriptionPlan: settings?.account?.subscription_plan,
      metadata: metadata,
    };

    this.setState({config});

    // Set some metadata on the widget to better understand usage
    await this.papercups.updateWidgetSettingsMetadata(metadata);

    return config;
  }

  customEventHandlers = (event: any) => {
    if (!event || !event.type) {
      return null;
    }

    const {type, detail} = event;

    switch (type) {
      case 'papercups:open':
        return this.setOpenState(true);
      case 'papercups:close':
        return this.setOpenState(false);
      case 'papercups:toggle':
        return this.handleToggleOpen();
      case 'storytime:customer:set':
        return console.warn(
          'No handler has been set up to handle event `storytime:customer:set`',
          detail
        );
      default:
        return null;
    }
  };

  setOpenState = (isOpen: boolean) => {
    // TODO: execute toggle callbacks
    // TODO: scroll to ref?
    this.setState({isOpen}, () => {
      this.handleVisibilityChange();

      if (isOpen) {
        this.scrollIntoView();
      }
    });
  };

  handleToggleOpen = () => {
    const {isOpen: wasOpen, isLoaded} = this.state;
    const isOpen = !wasOpen;

    // Prevent opening the widget until everything has loaded
    if (!isLoaded) {
      return;
    }

    this.setOpenState(isOpen);
  };

  handleChatLoaded = () => {
    this.setState({isLoaded: true});

    const {onChatLoaded = noop} = this.props;

    if (onChatLoaded && typeof onChatLoaded === 'function') {
      onChatLoaded();
    }
  };

  sendCustomerUpdate = (payload: any) => {
    const {customerId} = payload;
    const customerBrowserInfo = getUserInfo(window);
    const metadata = {
      ...customerBrowserInfo,
      ...this.papercups.formatCustomerMetadata(),
    };

    return this.papercups.updateExistingCustomer(customerId, metadata);
  };

  handleMessageReceived = (message: Message) => {
    const {onMessageReceived = noop} = this.props;
    const {user_id: userId, customer_id: customerId} = message;
    const isFromAgent = !!userId && !customerId;
    // Only invoke callback if message is from agent, because we currently track
    // `message:received` events to know if a message went through successfully
    if (isFromAgent) {
      onMessageReceived && onMessageReceived(message);
    }
  };

  handleMessageSent = (message: Message) => {
    const {onMessageSent = noop} = this.props;

    onMessageSent && onMessageSent(message);
  };

  handleUnseenMessages = (payload: any) => {
    this.logger.debug('Handling unseen messages:', payload);
    this.setState({shouldDisplayNotifications: true});
  };

  handleMessagesSeen = () => {
    this.logger.debug('Handling messages seen');
    this.setState({shouldDisplayNotifications: false});
  };

  onConversationCreated = (customerId: string, data: any) => {
    this.logger.debug('Handling conversation created:', data);
    const {customer: metadata} = this.props.config;

    setTimeout(() => this.fetchLatestConversation(customerId, metadata), 1000);
  };

  onSetCustomerId = (customerId: string) => {
    this.logger.debug('Setting customer ID:', customerId);

    this.setState({customerId});
  };

  onPresenceSync = (presence: Presence) => {
    this.logger.debug('Syncing presence:', presence.list());

    this.setState({
      availableAgents: presence
        .list()
        .map(({metas}) => {
          const [info] = metas;

          return info;
        })
        .filter((info) => !!info.user_id),
    });
  };

  scrollIntoView = () => {
    this.scrollToEl && this.scrollToEl.scrollIntoView(false);
  };

  // If the page is not visible (i.e. user is looking at another tab),
  // we want to mark messages as read once the chat widget becomes visible
  // again, as long as it's open.
  handleVisibilityChange = (e?: any) => {
    const doc = document || (e && e.target);

    if (isWindowHidden(doc)) {
      return;
    }

    const {messages = []} = this.state;
    const shouldMarkSeen = messages.some((msg) => this.shouldMarkAsSeen(msg));

    if (shouldMarkSeen) {
      this.markMessagesAsSeen();
    }
  };

  handlePapercupsPlan = (payload: any = {}) => {
    this.logger.debug('Handling subscription plan:', payload);

    // TODO: figure out the best way to determine when to display branding
    // const plan = payload && payload.plan;
    // const shouldDisplayBranding = plan
    //   ? String(plan).toLowerCase() === 'starter'
    //   : false;

    this.setState({shouldDisplayBranding: true});
  };

  // TODO: how is this different than `handleToggleOpen`?
  handleToggleDisplay = (payload: any = {}) => {
    const isOpen = !!payload.isOpen;

    this.setState({isOpen}, () => {
      this.handleVisibilityChange();

      if (isOpen) {
        this.scrollIntoView();
      }
    });
  };

  getDefaultGreeting = (): Array<Message> => {
    const {greeting} = this.props.config;

    if (!greeting) {
      return [];
    }

    return [
      {
        type: 'bot',
        customer_id: 'bot',
        body: greeting, // 'Hi there! How can I help you?',
        created_at: new Date().toISOString(), // TODO: what should this be?
        seen_at: new Date().toISOString(),
      },
    ];
  };

  // Check if we've seen this customer before; if we have, try to fetch
  // the latest existing conversation for that customer. Otherwise, we wait
  // until the customer initiates the first message to create the conversation.
  fetchLatestConversation = async (
    cachedCustomerId?: string | null,
    metadata?: CustomerMetadata
  ) => {
    // TODO: is there a way to split up some of this logic a little better?
    const customerId = await this.papercups.checkForExistingCustomer(
      metadata,
      cachedCustomerId
    );

    this.setState({customerId});

    if (!customerId) {
      // If there's no customerId, we haven't seen this customer before,
      // so do nothing until they try to create a new message
      this.setState({messages: [...this.getDefaultGreeting()]});

      return;
    }

    this.logger.debug('Fetching conversations for customer:', customerId);

    try {
      const conversation = await this.papercups.fetchLatestCustomerConversation(
        customerId
      );

      if (!conversation) {
        // If there are no conversations yet, wait until the customer creates
        // a new message to create the new conversation
        this.setState({messages: [...this.getDefaultGreeting()]});
        this.papercups.listenForNewConversations(customerId);

        return;
      }

      const {id: conversationId, messages = []} = conversation;
      const formattedMessages = messages.sort(
        (a: any, b: any) => +new Date(a.created_at) - +new Date(b.created_at)
      );

      this.setState({
        conversationId,
        messages: [...this.getDefaultGreeting(), ...formattedMessages],
      });

      this.joinConversationChannel(conversationId, customerId);

      await this.papercups.updateExistingCustomer(customerId, metadata);

      const unseenMessages = formattedMessages.filter(
        (msg: Message) => !msg.seen_at && !!msg.user_id
      );

      if (unseenMessages.length > 0) {
        const [firstUnseenMessage] = unseenMessages;

        this.handleUnseenMessages({message: firstUnseenMessage});
      }
    } catch (err) {
      this.logger.debug('Error fetching conversations!', err);
    }
  };

  joinConversationChannel = (conversationId: string, customerId?: string) => {
    this.papercups.joinConversationChannel(conversationId, customerId);

    // TODO: this is not handled in papercups.ts... how should we separate the logic?
    this.sendCustomerUpdate({conversationId, customerId});
    this.scrollIntoView();
  };

  handleNewMessage = (message: Message) => {
    this.handleMessageReceived(message);

    const {messages = []} = this.state;
    const unsent = messages.find(
      (m) =>
        !m.created_at &&
        areDatesEqual(m.sent_at, message.sent_at) &&
        (m.body === message.body || (!m.body && !message.body))
    );
    const updated = unsent
      ? messages.map((m) => (m.sent_at === unsent.sent_at ? message : m))
      : [...messages, message];

    this.setState({messages: updated}, () => {
      this.scrollIntoView();

      if (this.shouldMarkAsSeen(message)) {
        this.markMessagesAsSeen();
      } else if (!unsent) {
        // If the message was not `unsent`, we know it came from the other end,
        // in which case we should indicate that it hasn't been seen yet.
        this.handleUnseenMessages({message});
      }
    });
  };

  shouldMarkAsSeen = (message: Message) => {
    const {isOpen} = this.state;
    const {user_id: agentId, seen_at: seenAt} = message;
    const isAgentMessage = !!agentId;

    // If already seen or the page is not visible, don't mark as seen
    if (seenAt || isWindowHidden(document)) {
      return false;
    }

    return isAgentMessage && isOpen;
  };

  markMessagesAsSeen = () => {
    this.papercups.markMessagesAsSeen();

    this.handleMessagesSeen();
    this.setState({
      messages: this.state.messages.map((msg) => {
        return msg.seen_at ? msg : {...msg, seen_at: new Date().toISOString()};
      }),
    });
  };

  handleSendMessage = async (message: Partial<Message>, email?: string) => {
    const {customerId, conversationId, isSending} = this.state;
    const {body = '', file_ids = []} = message;
    const isMissingBody = !body || body.trim().length === 0;
    const isMissingAttachments = !file_ids || file_ids.length === 0;
    const shouldSkipSending = isMissingBody && isMissingAttachments;

    if (isSending || shouldSkipSending) {
      return;
    }

    // TODO: this seems to be unreliable
    const sentAt = new Date().toISOString();
    // TODO: figure out how this should work if `customerId` is null
    const payload: Message = {
      ...message,
      body,
      customer_id: customerId,
      type: 'customer',
      sent_at: sentAt,
    };

    this.setState(
      {
        messages: [...this.state.messages, payload],
      },
      () => this.scrollIntoView()
    );

    if (!customerId || !conversationId) {
      // TODO: this feels a bit hacky...
      // Can we just create the message within this call?
      await this.papercups.initializeNewConversation(customerId, email);
    }

    this.papercups.sendNewMessage({
      ...message,
      body,
      customer_id: this.state.customerId,
      sent_at: sentAt,
    });

    // TODO: should this only be emitted after the message is successfully sent?
    this.handleMessageSent({
      ...message,
      body,
      type: 'customer',
      sent_at: sentAt,
      customer_id: this.state.customerId,
      conversation_id: this.state.conversationId,
    });
  };

  // TODO: make it possible to disable this feature?
  renderUnreadMessages() {
    const MAX_CHARS = 140;
    const {notifications} = this.props;

    if (!notifications || typeof notifications !== 'function') {
      return null;
    }

    const {customerId, messages = []} = this.state;
    const unread = messages
      .filter((msg) => {
        const {seen_at: seen, body} = msg;

        if (seen) {
          return false;
        }

        // NB: `msg.type` doesn't come from the server, it's just a way to
        // help identify unsent messages in the frontend for now
        const isMe = isCustomerMessage(msg, customerId);

        return !isMe && body && body.trim().length > 0;
      })
      .slice(0, 2) // Only show the first 2 unread messages
      .map((msg) => {
        const {body = ''} = msg;

        return {...msg, body: shorten(body, MAX_CHARS)};
      });

    if (unread.length === 0) {
      return null;
    }

    // TODO: how should this be styled/positioned? (probably similar to toggle?)
    return (
      <NotificationsContainer isOpen>
        <Flex
          style={{
            background: 'transparent',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height: '100%',
            width: '100%',
            flex: 1,
          }}
        >
          {notifications({
            config: this.props.config,
            state: this.state,
            unread: unread,
            onToggleOpen: this.handleToggleOpen,
          })}
        </Flex>
      </NotificationsContainer>
    );
  }

  render() {
    const {config, styles = {}, children} = this.props;
    const {
      isOpen,
      shouldDisplayNotifications,
      shouldDisplayBranding,
    } = this.state;

    // TODO: set up a React context for this?
    if (children) {
      return children({
        config: config,
        state: this.state,
        // TODO: dedupe?
        onClose: this.handleToggleOpen,
        onToggleOpen: this.handleToggleOpen,
        onSendMessage: this.handleSendMessage,
        scrollToRef: (el: any) => (this.scrollToEl = el),
      });
    }

    return (
      <React.Fragment>
        {!isOpen && shouldDisplayNotifications && this.renderUnreadMessages()}

        <ChatWindowContainer
          className='Papercups-chatWindowContainer'
          isOpen={isOpen}
        >
          <Flex
            style={{
              background: '#fff',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              flex: 1,
            }}
          >
            {this.props.header &&
              this.props.header({
                config: config,
                state: this.state,
                onClose: this.handleToggleOpen,
              })}

            <Box
              style={{
                flex: 1,
                overflowY: 'scroll',
                // boxShadow: 'rgba(0, 0, 0, 0.2) 0px 21px 4px -20px inset',
                ...styles.body,
              }}
            >
              {this.props.body &&
                this.props.body({
                  config: config,
                  state: this.state,
                  scrollToRef: (el: any) => (this.scrollToEl = el),
                })}
            </Box>

            {shouldDisplayBranding && <PapercupsBranding />}

            {this.props.footer &&
              this.props.footer({
                config: config,
                state: this.state,
                onSendMessage: this.handleSendMessage,
              })}

            <img
              alt='Papercups'
              src='https://papercups.s3.us-east-2.amazonaws.com/papercups-logo.svg'
              width='0'
              height='0'
            />
          </Flex>
        </ChatWindowContainer>

        <ToggleButtonContainer className='Papercups-toggleButtonContainer'>
          {this.props.toggle &&
            this.props.toggle({
              config: config,
              state: this.state,
              onToggleOpen: this.handleToggleOpen,
            })}
        </ToggleButtonContainer>
      </React.Fragment>
    );
  }
}

export default ChatBuilder;
