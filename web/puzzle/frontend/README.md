# Harmony Puzzle

## Introduction

Harmony Puzzle is a simple (but addictive) puzzle game built to demonstrate how Harmony's block-chain ecosystem can be used.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Deploy

### Development deploy

```
./pushdev
```

### Deploy to puzzle.harmony.one

```
./push.sh
```

### Deploy to puzzle2.harmony.one

```
./push2.sh
```

## Project Structure

```bash
src
├── App.vue  -- Main app component and global css styles
├── assets   -- Sound and image files
├── components  -- Sub components under App.vue
│   ├── Chip.vue
│   ├── EmailPage.vue
│   ├── Game.vue
│   ├── HostingPage.vue
│   ├── KeyPage.vue
│   ├── PuzzlePage.vue
│   ├── RedeemPanel.vue
│   ├── StakePage.vue
│   ├── StakePanel.vue
│   ├── StakeRow.vue
│   ├── TutorialPage.vue
│   ├── TxHistoryLink.vue
│   ├── TxHistoryPanel.vue
│   └── WelcomePage.vue
├── filter.js  -- Register custom filters in Vue template
├── icon.js    -- Register font-awesome-icon Vue component
├── index.html -- Main html file
├── level-generator.js  -- Generate levels randomly with predefined difficulty
├── lib
│   └── sound.js  -- Play sound and music
├── main.js  -- Main js file
├── router
│   └── index.js  -- Routing file for Vuejs
├── service.js  -- Communicate with backend api
└── store.js  -- Global store for our app
```


For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

#versions
0.5
0.6 twitter integration
