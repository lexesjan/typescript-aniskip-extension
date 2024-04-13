# typescript-aniskip-extension

<a href="https://chrome.google.com/webstore/detail/aniskip/npfcdmjgaocepmpdnmliimijgfjbgcdd" target="_blank"><img src="https://imgur.com/3C4iKO0.png" width="64" height="64"></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/aniskip/" target="_blank"><img src="https://imgur.com/ihXsdDO.png" width="64" height="64"></a>
<a href="https://chrome.google.com/webstore/detail/aniskip/npfcdmjgaocepmpdnmliimijgfjbgcdd" target="_blank"><img src="https://imgur.com/nSJ9htU.png" width="64" height="64"></a>
<a href="https://chrome.google.com/webstore/detail/aniskip/npfcdmjgaocepmpdnmliimijgfjbgcdd" target="_blank"><img src="https://imgur.com/EuDp4vP.png" width="64" height="64"></a>
<a href="https://chrome.google.com/webstore/detail/aniskip/npfcdmjgaocepmpdnmliimijgfjbgcdd" target="_blank"><img src="https://imgur.com/z8yjLZ2.png" width="64" height="64"></a>

<img src="https://i.imgur.com/rUP9ebG.gif">

Web browser extension to skip anime openings and endings

## Discord

We are now on Discord! Want to contribute, need help or just want to ask questions? 

Join the Aniskip [Discord](https://discord.gg/UqT55CbrbE).

## Getting started

### Building and running the extension

#### Prerequisites

You will need to have installed:

1. [Node.js](https://nodejs.org/en/) v16.0.0 or greater
1. [Yarn](https://classic.yarnpkg.com/en/) v2.4.1 or greater

#### Running for development

1. Clone the repo

   ```
   git clone https://github.com/lexesjan/typescript-aniskip-extension
   ```

1. Navigate into the cloned GitHub repository

   ```
   cd typescript-aniskip-extension
   ```

1. Run the install and start script

   ```
   yarn install
   yarn start:dev:chrome
   ```

This will start a chromium browser with the built extension loaded. This script will reload the extension on file change. You can replace `chrome` with `firefox` to build for firefox.

#### Building for production

1. Clone the repo

   ```
   git clone https://github.com/lexesjan/typescript-aniskip-extension
   ```

1. Navigate into the cloned GitHub repository

   ```
   cd typescript-aniskip-extension
   ```

1. Run the install and start script

   ```
   yarn install
   yarn build:prod:chrome
   ```

This will build a zipped extension in the `web-ext-artifacts` folder. You can replace `chrome` with `firefox` to build for firefox.

### Contribution Guide

#### For supporting a webpage

There are two parts to a webpage, 
- The webpage itself (i.e. Crunchy Rolls https://github.com/aniskip/aniskip-extension/tree/main/src/pages/crunchyroll)
![image](https://github.com/aniskip/aniskip-extension/assets/43485369/0b7a7d61-ff50-4de7-8f04-9c5d2b233562)

- The video player (i.e. the stuff that actually runs the video https://github.com/aniskip/aniskip-extension/tree/main/src/players/crunchyroll)
![image](https://github.com/aniskip/aniskip-extension/assets/43485369/b60436cd-ed52-4f09-a641-b4aa2ff67fa4)

#### (web)Page

There are a two core function to implement, as seen in the [example](https://github.com/aniskip/aniskip-extension/tree/main/src/pages/crunchyroll)

##### Page Script
To inherit from [base-page.ts](https://github.com/aniskip/aniskip-extension/blob/main/src/pages/base-page.ts#L46)
```typescript
...
  // Implement a function to get the Anime Title (to map to MalID that we use as primary key (identifier) for skip times)
  getIdentifier(): string {
    ...
  }

  // Implement a function to get Episode Number
  getRawEpisodeNumber(): number {
    ...
  }
```
Note: The rest of the stuff are not required by default, they could very well inherited from legacy but not required for current/future players.

##### Metadata
[Example](https://github.com/aniskip/aniskip-extension/tree/main/src/pages)
This determines when the correspondent player script is used
Note: pattern [here](https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns), tl;dr: `*://x.y.z/*`
```typescript
{
  "pageUrls": ["*://www.crunchyroll.com/*"]
}
```

##### Index
[Example](https://github.com/aniskip/aniskip-extension/blob/main/src/pages/crunchyroll/index.ts)
This simply exports the functions, create the same for your player
```typescript
export * from './crunchyroll'; // whatever you named your player
```

#### (video) Player
This configures how we interact with the video player

##### (video) Player Script
[Example](https://github.com/aniskip/aniskip-extension/blob/main/src/players/videojs/videojs.ts)
Generally, you could very well copy and paste the whole thing here. As you can see from the examples, we read from [metadata.json](https://github.com/aniskip/aniskip-extension/blob/main/src/players/videojs/metadata.json) for the details.

Note: The example should provide a good starting point, if you need something custom, add it yourself! For example, some might have different selector for desktop and mobile, [example](https://github.com/aniskip/aniskip-extension/blob/main/src/players/crunchyroll/crunchyroll.ts#L16)
```typescript
  // Fetches the video container (the whole thing)
  getVideoContainer(): HTMLVideoElement | null {
    ...
  }

  // Fetches the video controls (the one with play/pause/adjust playback speed)
  getVideoControlsContainer(): HTMLElement | null {
   ...
  }

  // The button for fullscreen
  getSettingsButtonElement(): HTMLElement | null {
    ...
  }
```

##### Metadata
[Example](https://github.com/aniskip/aniskip-extension/blob/main/src/players/videojs/metadata.json)
This is where we have our core logic to interacting with the video player
```json
{
  "variant": "videojs", -- name of player
  "playerUrls": [  -- lists of urls (do note that more webpages will i-frame into video players' url, not the url of the webpage itself
    "*://dood.to/*", -- see pics below, for a different player
  ],
  "selectorStrings": {  -- some players are used across different webpages, but with slightly different name
    "default": {
      "videoContainerSelectorString": "Video Player", -- CSS selector that points to the video player (generally div)
      "videoControlsContainerSelectorString": "vjs-control-bar", -- CSS selector that points to video player's control bar
      "injectMenusButtonsReferenceNodeSelectorString": "vjs-fullscreen-control", -- CSS selector to fullscreen button
      "seekBarContainerSelectorString": "vjs-progress-holder vjs-slider" -- CSS selector to seekbar (the stuff that moves when you watch the video)
    },
    "dood": { -- other subvariants
     ...
    },
  }
}
```
Example of the player container
![image](https://github.com/aniskip/aniskip-extension/assets/43485369/3d9ee56f-6b7c-4809-8cc5-995b5e39f4cc)

##### Index
[Example](https://github.com/aniskip/aniskip-extension/blob/main/src/players/videojs/index.ts)
Exports all defined function, no change required.
```typescript
export * from './videojs'; // player script that you defined
```

##### Styles
[Example](https://github.com/aniskip/aniskip-extension/blob/main/src/players/videojs/styles.scss)
CSS to make stuff prettier
Note: [CSS 101](https://www.w3schools.com/css/css_intro.asp), or learn by modifying existing ones

#### So how do we link Pages with Player?
Short answer: We don't need to
Long answer: In pages we defined where is the video player container, this essentially gives us the player url, and we defined which player script to run for which urls in the metadata.
