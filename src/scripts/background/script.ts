import { browser, Runtime } from 'webextension-polyfill-ts';
import ky from 'ky';
import {
  LocalOptions,
  Message,
  DEFAULT_LOCAL_OPTIONS,
  DEFAULT_SYNC_OPTIONS,
  SyncOptions,
} from './types';
import { parseResponse } from '../../utils';

/**
 * Relay messages between content scripts.
 *
 * @param message Message containing the type of action and the payload.
 * @param sender Sender of the message.
 */
const messageHandler = (
  message: Message,
  sender: Runtime.MessageSender
): Promise<any> => {
  const tabId = sender.tab?.id;

  if (!tabId) {
    return Promise.reject(new Error('Tab id not found'));
  }

  switch (message.type) {
    case 'fetch': {
      return (async (): Promise<any> => {
        try {
          const { url, config } = message.payload;
          const response = await ky(url, config);

          return {
            data: await parseResponse(response),
            status: response.status,
            ok: response.ok,
          };
        } catch (err: any) {
          return {
            data: await parseResponse(err.response),
            status: err.response.status,
            ok: err.response.ok,
          };
        }
      })();
    }
    default: {
      return browser.tabs.sendMessage(tabId, message);
    }
  }
};

browser.runtime.onMessage.addListener(messageHandler);

/**
 * Adds the default sync options if they do not exist.
 */
const addDefaultSyncOptions = async (): Promise<void> => {
  const currentSyncOptions = await browser.storage.sync.get(
    DEFAULT_SYNC_OPTIONS
  );

  // If the key does not exist, add a default for it.
  Object.keys(DEFAULT_SYNC_OPTIONS).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(currentSyncOptions, key)) {
      const typedKey = key as keyof SyncOptions;

      currentSyncOptions[typedKey] = DEFAULT_SYNC_OPTIONS[typedKey];
    }
  });

  // Add default skip options if they are not present.
  Object.keys(DEFAULT_SYNC_OPTIONS.skipOptions).forEach((key) => {
    if (
      !Object.prototype.hasOwnProperty.call(currentSyncOptions.skipOptions, key)
    ) {
      const typedKey = key as keyof SyncOptions['skipOptions'];

      currentSyncOptions.skipOptions[typedKey] =
        DEFAULT_SYNC_OPTIONS.skipOptions[typedKey];
    }
  });

  // Add default skip indicator colours if they are not present.
  Object.keys(DEFAULT_SYNC_OPTIONS.skipTimeIndicatorColours).forEach((key) => {
    if (
      !Object.prototype.hasOwnProperty.call(
        currentSyncOptions.skipTimeIndicatorColours,
        key
      )
    ) {
      const typedKey = key as keyof SyncOptions['skipTimeIndicatorColours'];

      currentSyncOptions.skipTimeIndicatorColours[typedKey] =
        DEFAULT_SYNC_OPTIONS.skipTimeIndicatorColours[typedKey];
    }
  });

  // Add default keybinds if they are not present.
  Object.keys(DEFAULT_SYNC_OPTIONS.keybinds).forEach((key) => {
    if (
      !Object.prototype.hasOwnProperty.call(currentSyncOptions.keybinds, key)
    ) {
      const typedKey = key as keyof SyncOptions['keybinds'];

      currentSyncOptions.keybinds[typedKey] =
        DEFAULT_SYNC_OPTIONS.keybinds[typedKey];
    }
  });

  browser.storage.sync.set(currentSyncOptions);
};

/**
 * Adds the default local options if they do not exist.
 */
const addDefaultLocalOptions = async (): Promise<void> => {
  const currentLocalOptions = await browser.storage.local.get(
    DEFAULT_LOCAL_OPTIONS
  );

  // If the key does not exist, add a default for it.
  Object.keys(DEFAULT_LOCAL_OPTIONS).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(currentLocalOptions, key)) {
      const typedKey = key as keyof LocalOptions;

      currentLocalOptions[typedKey] = DEFAULT_LOCAL_OPTIONS[typedKey];
    }
  });

  browser.storage.local.set(currentLocalOptions);
};

/**
 * Resets the local cache.
 */
const resetCache = async (): Promise<void> => {
  const currentLocalOptions = (await browser.storage.local.get(
    DEFAULT_LOCAL_OPTIONS
  )) as LocalOptions;

  // Reset cache.
  currentLocalOptions.malIdCache = {};
  currentLocalOptions.rulesCache = {};

  browser.storage.local.set(currentLocalOptions);
};

/**
 * Shows the changelog notification on update.
 */
const showChangelogNotification = async (): Promise<void> =>
  browser.storage.sync.set({
    isChangelogNotificationVisible: true,
  } as Partial<SyncOptions>);

/**
 * Set default user settings on installation.
 */
browser.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case 'install': {
      browser.storage.sync.set(DEFAULT_SYNC_OPTIONS);
      browser.storage.local.set(DEFAULT_LOCAL_OPTIONS);
      browser.runtime.openOptionsPage();
      break;
    }
    case 'update': {
      Promise.all([
        (async (): Promise<void> => {
          await addDefaultSyncOptions();
          return showChangelogNotification();
        })(),
        (async (): Promise<void> => {
          await addDefaultLocalOptions();
          return resetCache();
        })(),
      ]);
      break;
    }
    default:
    // no default
  }
});
