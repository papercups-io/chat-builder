import ChatBuilder, {
  BodyProps,
  Config,
  FooterProps,
  HeaderProps,
  NotificationsProps,
  OnSendMessage,
  Options,
  ScrollToRef,
  State,
  ToggleButtonProps,
} from './components/ChatBuilder';
import ChatHeader from './components/ChatHeader';
import ChatBody from './components/ChatBody';
import ChatFooter from './components/ChatFooter';
import ChatToggle from './components/ChatToggle';
import {
  User,
  Message,
  Attachment,
  CustomerMetadata,
  WidgetSettings,
  WidgetConfig,
} from './helpers/types';

export type {
  Attachment,
  BodyProps,
  Config,
  CustomerMetadata,
  FooterProps,
  HeaderProps,
  Message,
  NotificationsProps,
  OnSendMessage,
  Options,
  ScrollToRef,
  State,
  ToggleButtonProps,
  User,
  WidgetConfig,
  WidgetSettings,
};

export {ChatBuilder, ChatHeader, ChatBody, ChatFooter, ChatToggle};
