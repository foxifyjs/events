# Events <!-- omit in toc -->

`@foxify/events` is a high performance EventEmitter alternative for Node.js and browser that has been optimized to be faster than the native version, (why not?!).

[![NPM Version](https://img.shields.io/npm/v/@foxify/events.svg)](https://www.npmjs.com/package/@foxify/events)
[![TypeScript Version](https://img.shields.io/npm/types/@foxify/events.svg)](https://www.typescriptlang.org)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@foxify/events.svg)](https://www.npmjs.com/package/@foxify/events)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@foxify/events.svg)](https://www.npmjs.com/package/@foxify/events)
[![Tested With Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Pull Requests](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/foxifyjs/events/pulls)
[![License](https://img.shields.io/github/license/foxifyjs/events.svg)](https://github.com/foxifyjs/events/blob/master/LICENSE)
[![Build Status](https://api.travis-ci.com/foxifyjs/events.svg?branch=master)](https://travis-ci.com/foxifyjs/events)
[![Coverage Status](https://codecov.io/gh/foxifyjs/events/branch/master/graph/badge.svg)](https://codecov.io/gh/foxifyjs/events)
[![Package Quality](http://npm.packagequality.com/shield/%40foxify%2Fodin.svg)](http://packagequality.com/#?package=@foxify/events)
[![Dependencies Status](https://david-dm.org/foxifyjs/events.svg)](https://david-dm.org/foxifyjs/events)
[![NPM Total Downloads](https://img.shields.io/npm/dt/@foxify/events.svg)](https://www.npmjs.com/package/@foxify/events)
[![NPM Monthly Downloads](https://img.shields.io/npm/dm/@foxify/events.svg)](https://www.npmjs.com/package/@foxify/events)
[![Open Issues](https://img.shields.io/github/issues-raw/foxifyjs/events.svg)](https://github.com/foxifyjs/events/issues?q=is%3Aopen+is%3Aissue)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/foxifyjs/events.svg)](https://github.com/foxifyjs/events/issues?q=is%3Aissue+is%3Aclosed)
[![known vulnerabilities](https://snyk.io/test/github/foxifyjs/events/badge.svg?targetFile=package.json)](https://snyk.io/test/github/foxifyjs/events?targetFile=package.json)
[![Github Stars](https://img.shields.io/github/stars/foxifyjs/events.svg?style=social)](https://github.com/foxifyjs/events)
[![Github Forks](https://img.shields.io/github/forks/foxifyjs/events.svg?style=social&label=Fork)](https://github.com/foxifyjs/events)

This module is API compatible with the EventEmitter that ships by default with Node.js but there are some slight differences:

- The `newListener` and `removeListener` events have been removed as they are useful only in some uncommon use-cases.
- The `setMaxListeners` and `getMaxListeners` methods are not available.
- Support for custom context for events so there is no need to use `bind`.
- Support for strict events in TypeScript.

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Usage](#usage)
  - [Strict events](#strict-events)
  - [Contextual emits](#contextual-emits)
- [Benchmarks](#benchmarks)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)

## Installation

```bash
npm i @foxify/events
```

## Usage

```js
const { EventEmitter } = require("@foxify/events");
```

For the API documentation, please follow the official Node.js [documentation](https://nodejs.org/api/events.html).

### Strict events

> "error" event is always defined by default because of its different behavior

```ts
interface Events {
  foo: (bar: string) => void;
}

const eventEmitter = new EventEmitter<Events>();

// or

class Emitter extends EventEmitter<Events> {
}

const eventEmitter = new Emitter();

// Throws an error, since this event requires the "bar" argument of type "string"
eventEmitter.emit("foo");

// Works just fine
eventEmitter.emit("foo");

// Works just fine. so don't worry about "ImplicitAny" config, since type of "bar" is defined as "string"
eventEmitter.on("foo", bar => 1);

```

### Contextual emits

We've upgraded the API of the `on`, `once`, `addListener`, `prependListener` and
`prependOnceListener` to accept an extra argument which is the `context`
or `this` value that should be set for the emitted events. This means you no
longer have the overhead of an event that required `bind` in order to get a
custom `this` value.

```js
const eventEmitter = new EventEmitter();
const context = { foo: "bar" };

function emitted() {
  console.log(this === context); // true
}

eventEmitter.on("event:1", emitted, context);
eventEmitter.once("event:2", emitted, context);
eventEmitter.addListener("event:3", emitted, context);
eventEmitter.prependListener("event:4", emitted, context);
eventEmitter.prependOnceListener("event:5", emitted, context);
```

## Benchmarks

```bash
npm run benchmarks
```

## Versioning

We use [SemVer](http://semver.org) for versioning. For the versions available, see the [tags on this repository](https://github.com/foxifyjs/events/tags).

## Authors

- **Ardalan Amini** - *Core Maintainer* - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors](https://github.com/foxifyjs/events/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
