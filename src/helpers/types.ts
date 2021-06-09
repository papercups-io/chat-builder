export type User = {
  id: number;
  email: string;
  display_name?: string;
  full_name?: string;
  profile_photo_url?: string;
};

export type Message = {
  id?: string;
  body?: string;
  sent_at?: string;
  seen_at?: string;
  created_at?: string;
  customer_id?: string | null;
  conversation_id?: string | null;
  user_id?: number;
  user?: User;
  type?: 'bot' | 'agent' | 'customer';
  file_ids?: Array<string>;
  attachments?: Array<Attachment>;
};

export type Attachment = {
  id: string;
  filename: string;
  file_url: string;
  content_type: string;
};

export type CustomerMetadata = {
  name?: string;
  email?: string;
  external_id?: string;
  metadata?: {[key: string]: any};
  // TODO: include browser info
  host?: string;
  pathname?: string;
  current_url?: string;
  browser?: string;
  os?: string;
  ip?: string;
  time_zone?: string;
} | null;

export type Account = {
  company_name?: string;
  subscription_plan?: string;
  is_outside_working_hours?: boolean;
};

export type WidgetSettings = {
  subtitle?: string;
  title?: string;
  base_url?: string;
  color?: string;
  greeting?: string;
  new_message_placeholder?: string;
  email_input_placeholder?: string;
  new_messages_notification_text?: string;
  show_agent_availability?: boolean;
  agent_available_text?: string;
  agent_unavailable_text?: string;
  require_email_upfront?: boolean;
  is_open_by_default?: boolean;
  custom_icon_url?: string;
  iframe_url_override?: string;
  icon_variant?: string;
  account?: Account;
};

export type WidgetConfig = {
  accountId?: string;
  baseUrl?: string;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  greeting?: string;
  awayMessage?: string;
  newMessagePlaceholder?: string;
  emailInputPlaceholder?: string;
  newMessagesNotificationText?: string;
  companyName?: string;
  agentAvailableText?: string;
  agentUnavailableText?: string;
  showAgentAvailability?: boolean | 1 | 0;
  requireEmailUpfront?: boolean | 1 | 0;
  closeable?: boolean | 1 | 0;
  customerId?: string;
  subscriptionPlan?: string;
  metadata?: any; // stringified JSON
  version?: string;
};
