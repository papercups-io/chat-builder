import {Message} from './types';

export function noop() {}

export const DEFAULT_BASE_URL = 'https://app.papercups.io';

export const isDev = (w: any) => {
  return Boolean(
    w.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      w.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      w.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );
};

export const getWebsocketUrl = (baseUrl = DEFAULT_BASE_URL) => {
  // TODO: handle this parsing better
  const [protocol, host] = baseUrl.split('://');
  const isHttps = protocol === 'https';

  // TODO: not sure how websockets work with subdomains
  return `${isHttps ? 'wss' : 'ws'}://${host}/socket`;
};

// TODO: handle this on the server instead
export function now() {
  const date = new Date();

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// Returns the words (or whatever substrings based on the `separator`)
// in a string up until the point of meeting the`max` character limit
export function shorten(str: string, max: number, separator = ' ') {
  if (str.length <= max) {
    return str;
  }

  return str.substr(0, str.lastIndexOf(separator, max)).concat('...');
}

export function shouldActivateGameMode(message?: string) {
  if (!message || !message.length) {
    return false;
  }

  return (
    [
      '/play2048',
      '/xyzzy',
      '/poweroverwhelming',
      '/howdoyouturnthison',
      'what is 2^11',
      'what is 2^11?',
      "what's 2^11",
      "what's 2^11?",
    ].indexOf(message.toLowerCase()) !== -1
  );
}

export function setupPostMessageHandlers(w: any, handler: (msg: any) => void) {
  const cb = (msg: any) => {
    handler(msg);
  };

  if (w.addEventListener) {
    w.addEventListener('message', cb);

    return () => w.removeEventListener('message', cb);
  } else {
    w.attachEvent('onmessage', cb);

    return () => w.detachEvent('message', cb);
  }
}

export const setupCustomEventHandlers = (
  w: any,
  events: Array<string>,
  handlers: (e: any) => void
) => {
  if (w.addEventListener) {
    for (const event of events) {
      w.addEventListener(event, handlers);
    }

    return () => events.map((event) => w.removeEventListener(event, handlers));
  } else {
    console.error('Custom events are not supported in your browser!');

    return noop;
  }
};

export const isCustomerMessage = (
  message: Message,
  customerId?: string | null
): boolean => {
  return (
    message.customer_id === customerId ||
    (!!message.sent_at && message.type === 'customer')
  );
};

export const areDatesEqual = (x?: string, y?: string) => {
  if (!x || !y) {
    return false;
  }

  return Math.floor(+new Date(x) / 1000) === Math.floor(+new Date(y) / 1000);
};

export const isValidUuid = (id: any) => {
  if (!id || !id.length) {
    return false;
  }

  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return regex.test(id);
};
