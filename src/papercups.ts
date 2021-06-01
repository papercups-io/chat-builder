// import {Channel, Presence, Socket} from 'phoenix';
// import {CustomerMetadata, Message, WidgetSettings} from './index';
// import * as API from './helpers/api';
// import Logger from './helpers/logger';
// import {getWebsocketUrl, isDev} from './config';
// import store from './storage';
// import {isValidUuid} from './helpers/utils';

// type PapercupsConfig = {
//   accountId: string;
//   customerId?: string | null;
//   baseUrl?: string;
//   customer?: CustomerMetadata;
//   debug?: boolean;
//   onSetCustomerId?: (customerId: string) => void;
//   onPresenceSync: (data: any) => void;
//   onConversationCreated: (customerId: string, data: any) => void;
//   onMessageCreated: (data: any) => void;
// };

// export class Papercups {
//   socket: Socket;
//   channel?: Channel;
//   logger: Logger;
//   storage: any; // TODO
//   config: PapercupsConfig;

//   customerId: string | null;
//   conversationId: string | null;
//   messages: Array<Message>;

//   constructor(config: PapercupsConfig) {
//     const w = window as any;
//     const {customerId, debug: isDebugMode = false} = config;
//     const debugModeEnabled = isDev(w) || isDebugMode;

//     this.config = config;
//     this.logger = new Logger(debugModeEnabled);
//     this.storage = store(w);

//     this.customerId = customerId || this.getCachedCustomerId() || null;
//     this.conversationId = null;
//     this.messages = [];
//   }

//   static init = (config: PapercupsConfig) => {
//     return new Papercups(config);
//   };

//   connect = () => {
//     const {baseUrl} = this.config;
//     const websocketUrl = getWebsocketUrl(baseUrl);

//     this.socket = new Socket(websocketUrl);
//     this.socket.connect();
//     this.listenForAgentAvailability();
//   };

//   disconnect = () => {
//     this.socket.disconnect();
//     this.channel?.leave();
//   };

//   setCustomerId = (customerId: string) => {
//     this.customerId = customerId;
//     this.cacheCustomerId(customerId);

//     // Let other modules know that the customer has been set
//     window.dispatchEvent(
//       new CustomEvent('papercups:customer:set', {
//         detail: customerId,
//       })
//     );

//     if (this.config.onSetCustomerId) {
//       this.config.onSetCustomerId(customerId);
//     }
//   };

//   setConversationId = (conversationId: string) => {
//     this.conversationId = conversationId;
//   };

//   listenForAgentAvailability = () => {
//     const {accountId} = this.config;
//     const room = this.socket.channel(`room:${accountId}`, {});

//     room
//       .join()
//       .receive('ok', (res: any) => {
//         this.logger.debug('Joined room successfully!', res);
//       })
//       .receive('error', (err: any) => {
//         this.logger.debug('Unable to join room!', err);
//       });

//     const presence = new Presence(room);

//     presence.onSync(() => {
//       this.logger.debug('Syncing presence:', presence.list());
//       this.config.onPresenceSync(presence);
//     });
//   };

//   listenForNewConversations = (customerId: string) => {
//     const channel = this.socket.channel(`conversation:lobby:${customerId}`, {});

//     // TODO: what does this data look like?
//     channel.on('conversation:created', (data: any) => {
//       this.config.onConversationCreated(customerId, data);
//     });

//     channel
//       .join()
//       .receive('ok', (res: any) => {
//         this.logger.debug('Successfully listening for new conversations!', res);
//       })
//       .receive('error', (err: any) => {
//         this.logger.debug('Unable to listen for new conversations!', err);
//       });
//   };

//   joinConversationChannel = (conversationId: string, customerId?: string) => {
//     if (this.channel && this.channel.leave) {
//       this.channel.leave(); // TODO: what's the best practice here?
//     }

//     this.logger.debug('Joining channel:', conversationId);
//     this.channel = this.socket.channel(`conversation:${conversationId}`, {
//       customer_id: customerId,
//     });

//     this.channel.on('shout', (message: any) => {
//       this.config.onMessageCreated(message);
//     });

//     this.channel
//       .join()
//       .receive('ok', (res: any) => {
//         this.logger.debug('Joined conversation successfully!', res);
//       })
//       .receive('error', (err: any) => {
//         this.logger.debug('Unable to join conversation!', err);
//       });
//   };

//   createNewConversation = async (customerId: string) => {
//     const {accountId, baseUrl} = this.config;

//     return API.createNewConversation(accountId, customerId, baseUrl);
//   };

//   initializeNewConversation = async (
//     existingCustomerId?: string | null,
//     email?: string
//   ) => {
//     // TODO: don't handle setting customer ID cache in this method?
//     const customerId = await this.createOrUpdateCustomer(
//       existingCustomerId,
//       email
//     );
//     const {id: conversationId} = await this.createNewConversation(customerId);

//     this.joinConversationChannel(conversationId, customerId);
//   };

//   updateCustomerMetadata = (customerId: string, metadata: CustomerMetadata) => {
//     const {baseUrl} = this.config;

//     return API.updateCustomerMetadata(customerId, metadata, baseUrl);
//   };

//   createNewCustomer = (customer: CustomerMetadata) => {
//     const {baseUrl, accountId} = this.config;

//     return API.createNewCustomer(accountId, customer, baseUrl);
//   };

//   createOrUpdateCustomer = async (
//     existingCustomerId?: string | null,
//     email?: string
//   ): Promise<string> => {
//     const {customer = {}} = this.config;
//     const metadata = email ? {...customer, email} : customer;

//     try {
//       const customer = existingCustomerId
//         ? await this.updateCustomerMetadata(existingCustomerId, metadata)
//         : await this.createNewCustomer(metadata);
//       const {id: customerId} = customer;

//       // TODO: not sure we should be doing this within the context of this function...
//       if (!existingCustomerId) {
//         this.setCustomerId(customerId);
//       }

//       return customerId;
//     } catch (err) {
//       // TODO: this edge case may occur if the cached customer ID somehow
//       // gets messed up (e.g. between dev and prod environments). The long term
//       // fix should be changing the cache key for different environments.
//       this.logger.error('Failed to update or create customer:', err);
//       this.logger.error('Retrying...');

//       const {id: customerId} = await this.createNewCustomer(metadata);

//       this.setCustomerId(customerId);

//       return customerId;
//     }
//   };

//   fetchWidgetSettings = async (): Promise<WidgetSettings> => {
//     const {accountId, baseUrl} = this.config;
//     const empty = {} as WidgetSettings;

//     return API.fetchWidgetSettings(accountId, baseUrl)
//       .then((settings) => settings || empty)
//       .catch(() => empty);
//   };

//   updateWidgetSettingsMetadata = async (metadata: any) => {
//     const {accountId, baseUrl} = this.config;

//     return API.updateWidgetSettingsMetadata(accountId, metadata, baseUrl).catch(
//       (err) => {
//         // No need to block on this
//         this.logger.error('Failed to update widget metadata:', err);
//       }
//     );
//   };

//   findCustomerByExternalId = async (
//     metadata: CustomerMetadata
//   ): Promise<string | null> => {
//     if (!metadata || !metadata?.external_id) {
//       return null;
//     }

//     const {accountId, baseUrl} = this.config;
//     // NB: we check for matching existing customers based on external_id, email,
//     // and host -- this may break across subdomains, but I think this is fine for now.
//     const {email, host, external_id: externalId} = metadata;
//     const filters = {email, host};
//     // TODO: make this opt-in?
//     const {
//       customer_id: matchingCustomerId,
//     } = await API.findCustomerByExternalId(
//       externalId,
//       accountId,
//       filters,
//       baseUrl
//     );

//     return matchingCustomerId;
//   };

//   checkForExistingCustomer = async (
//     metadata?: CustomerMetadata,
//     defaultCustomerId?: string | null
//   ): Promise<string | null | undefined> => {
//     if (!metadata || !metadata?.external_id) {
//       return defaultCustomerId;
//     }

//     const matchingCustomerId = await this.findCustomerByExternalId(metadata);

//     if (!matchingCustomerId) {
//       return null;
//     } else if (matchingCustomerId === defaultCustomerId) {
//       return defaultCustomerId;
//     } else {
//       // Emit update so we can cache the ID in the parent window
//       this.setCustomerId(matchingCustomerId);

//       return matchingCustomerId;
//     }
//   };

//   updateExistingCustomer = async (
//     customerId: string,
//     metadata?: CustomerMetadata
//   ) => {
//     if (!metadata) {
//       return;
//     }

//     try {
//       await this.updateCustomerMetadata(customerId, metadata);
//     } catch (err) {
//       this.logger.debug('Error updating customer metadata!', err);
//     }
//   };

//   fetchLatestCustomerConversation = async (customerId: string) => {
//     const {accountId, baseUrl} = this.config;

//     return API.fetchCustomerConversations(customerId, accountId, baseUrl).then(
//       (conversations) => {
//         this.logger.debug('Found existing conversations:', conversations);
//         const [latest] = conversations;

//         return latest || null;
//       }
//     );
//   };

//   getCachedCustomerId = () => {
//     return this.storage.getCustomerId();
//   };

//   cacheCustomerId = (customerId: string) => {
//     this.logger.debug('Caching customer ID:', customerId);
//     // TODO: don't depend on storage working? (also add support for local/session/cookies)
//     this.storage.setCustomerId(customerId);
//     // // Let other modules know that the customer has been set
//     // window.dispatchEvent(
//     //   new CustomEvent('papercups:customer:set', {
//     //     detail: customerId,
//     //   })
//     // );
//   };

//   markMessagesAsSeen = () => {
//     this.channel?.push('messages:seen', {});
//   };

//   sendNewMessage = (message: Partial<Message>) => {
//     this.channel?.push('shout', message);
//   };

//   isValidCustomer = (customerId: string) => {
//     const {baseUrl, accountId} = this.config;

//     return API.isValidCustomer(customerId, accountId, baseUrl);
//   };

//   isValidCustomerId = async (customerId?: string | null) => {
//     if (!customerId || !customerId.length) {
//       return false;
//     }

//     if (!isValidUuid(customerId)) {
//       return false;
//     }

//     try {
//       const isValidCustomer = await this.isValidCustomer(customerId);

//       return isValidCustomer;
//     } catch (err) {
//       this.logger.warn('Failed to validate customer ID.');
//       this.logger.warn('You might be on an older version of Papercups.');
//       // Return true for backwards compatibility
//       return true;
//     }
//   };

//   formatCustomerMetadata = () => {
//     const {customer = {}} = this.config;

//     if (!customer) {
//       return {};
//     }

//     return Object.keys(customer).reduce((acc, key) => {
//       if (key === 'metadata') {
//         return {...acc, [key]: customer[key]};
//       } else {
//         // Make sure all other passed-in values are strings
//         return {...acc, [key]: String(customer[key])};
//       }
//     }, {});
//   };

//   /**
//    * TODO: CLEAN THIS SHIT UP BELOW!
//    */

//   // initialize?

//   // load?

//   // start?

//   // identify?

//   notify = (
//     type: 'slack' | 'email' | 'chat' | 'something_else_i_havent_thought_of_yet',
//     message: string,
//     options = {}
//   ) => {
//     console.log({type, message, options});
//     // TODO: make it super easy to send notifications from brower
//     // consider rate limiting? blacklisting/whitelisting?
//     // start new conversation vs send in existing?
//     // tagging/labeling from function? (e.g. "feedback", "bug", etc?)
//     // options can include... name, email, customer info, metadata?
//   };

//   // Check if we've seen this customer before; if we have, try to fetch
//   // the latest existing conversation for that customer. Otherwise, we wait
//   // until the customer initiates the first message to create the conversation.
//   fetchLatestConversation = async (
//     cachedCustomerId?: string | null,
//     metadata?: CustomerMetadata
//   ) => {
//     // TODO: is there a way to split up some of this logic a little better?
//     const customerId = await this.checkForExistingCustomer(
//       metadata,
//       cachedCustomerId
//     );

//     // this.setState({customerId});

//     if (!customerId) {
//       // If there's no customerId, we haven't seen this customer before,
//       // so do nothing until they try to create a new message
//       // this.setState({messages: [...this.getDefaultGreeting()]});

//       return;
//     }

//     this.logger.debug('Fetching conversations for customer:', customerId);

//     try {
//       const conversation = await this.fetchLatestCustomerConversation(
//         customerId
//       );

//       if (!conversation) {
//         // If there are no conversations yet, wait until the customer creates
//         // a new message to create the new conversation
//         // this.setState({messages: [...this.getDefaultGreeting()]});
//         this.listenForNewConversations(customerId);

//         return;
//       }

//       const {id: conversationId, messages = []} = conversation;
//       const formattedMessages = messages.sort(
//         (a: any, b: any) => +new Date(a.created_at) - +new Date(b.created_at)
//       );

//       // this.setState({
//       //   conversationId,
//       //   messages: [...this.getDefaultGreeting(), ...formattedMessages],
//       // });

//       this.joinConversationChannel(conversationId, customerId);

//       await this.updateExistingCustomer(customerId, metadata);

//       const unseenMessages = formattedMessages.filter(
//         (msg: Message) => !msg.seen_at && !!msg.user_id
//       );

//       if (unseenMessages.length > 0) {
//         // const [firstUnseenMessage] = unseenMessages;
//         // this.handleUnseenMessages({message: firstUnseenMessage});
//       }
//     } catch (err) {
//       this.logger.debug('Error fetching conversations!', err);
//     }
//   };
// }
