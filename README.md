# Events

`@foxify/events` is a `EventEmitter` alternative for `Node.js` and `browser` that has been optimized for better
performance compared to the native version.

[![Build Status][BUILD_BADGE]][BUILD_URI]
[![Coverage Status][COVERAGE_BADGE]][COVERAGE_URI]
[![NPM Version][VERSION_BADGE]][NPM_URI]
[![npm bundle size (minified)][MINIFIED_BADGE]][NPM_URI]
[![npm bundle size (minified + gzip)][GZIP_BADGE]][NPM_URI]
[![NPM Monthly Downloads][MONTHLY_DOWNLOADS_BADGE]][NPM_URI]
[![NPM Total Downloads][TOTAL_DOWNLOADS_BADGE]][NPM_URI]
[![Dependencies Status][DEPENDENCY_STATUS_BADGE]][DEPENDENCY_STATUS_URI]
[![Open Issues][OPEN_ISSUES_BADGE]][OPEN_ISSUES_URI]
[![Pull Requests][PR_BADGE]][PR_URI]
[![License][LICENSE_BADGE]][LICENSE_URI]

This module is API compatible with the `EventEmitter` that ships by default with Node.js but there are some slight
differences:

- The `newListener` and `removeListener` events have been removed as they are useful only in some uncommon use-cases.
- The `setMaxListeners` and `getMaxListeners` methods are not available.
- Support for custom context for events so there is no need to use `bind`.
- Support for strict events in `TypeScript`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Strict events](#strict-events)
  - [Contextual emits](#contextual-emits)
- [Benchmarks](#benchmarks)
- [Tests](#tests)
- [Coverage](#coverage)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)

## Installation

```shell
npm i @foxify/events
```

## Usage

JavaScript:

```javascript
const EventEmitter = require("@foxify/events").default;
```

TypeScript:

```typescript
import EventEmitter from "@foxify/events";
```

For the API documentation, please follow the official Node.js [documentation](https://nodejs.org/api/events.html).

### Strict events

> "error" event is always defined by default because of its different behavior

first create events type (optional)

```typescript
type Events = {
  foo: (bar: string) => void;
  withContextEnforcement: (this: number, bar: number) => void;
}
```

then create a new direct/extended instance

```typescript
const eventEmitter = new EventEmitter<Events>();
```

```typescript
class Emitter extends EventEmitter<Events> {
}

const eventEmitter = new Emitter();
```

then start emitting & listening to events

```typescript
// Works just fine. so don't worry about "ImplicitAny" config, since type of "bar" is defined as "string"
eventEmitter.on("foo", bar => 1);

// This works fine as well
eventEmitter.on("withContextEnforcement", function (bar) {
  return this + bar;
}, 1);

// Throws an error (TS compile time), since this event requires the "bar" argument of type "string"
eventEmitter.emit("foo");

// Works just fine
eventEmitter.emit("foo", "bar");
```

### Contextual emits

We've upgraded the API of the `on`, `once`, `addListener`, `prependListener` and
`prependOnceListener` to accept an extra argument which is the `context`
or `this` value that should be set for the emitted events. This means you no longer have the overhead of an event that
required `bind` in order to get a custom `this` value.

```javascript
const eventEmitter = new EventEmitter();
const context = { foo: "bar" };

function listener() {
  console.log(this === context); // true
}

eventEmitter.on("event:1", listener, context);
eventEmitter.once("event:2", listener, context);
eventEmitter.addListener("event:3", listener, context);
eventEmitter.prependListener("event:4", listener, context);
eventEmitter.prependOnceListener("event:5", listener, context);
```

## Benchmarks

```shell
npm run benchmarks
```

## Tests

```shell
npm test
```

## Coverage

```shell
npm run test:coverage
```

## Versioning

We use [SemVer](http://semver.org) for versioning. For the versions available, see
the [releases on this repository](https://github.com/foxifyjs/events/releases).

## Authors

- **Ardalan Amini** - *Core Maintainer* - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors](https://github.com/foxifyjs/events/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE][LICENSE_URI] file for details


[BUILD_BADGE]: https://github.com/foxifyjs/events/workflows/Test/badge.svg

[BUILD_URI]: https://github.com/foxifyjs/events/actions

[COVERAGE_BADGE]: https://codecov.io/gh/foxifyjs/events/branch/master/graph/badge.svg

[COVERAGE_URI]: https://codecov.io/gh/foxifyjs/events

[VERSION_BADGE]: https://img.shields.io/npm/v/@foxify/events.svg

[MINIFIED_BADGE]: https://img.shields.io/bundlephobia/min/@foxify/events.svg

[GZIP_BADGE]: https://img.shields.io/bundlephobia/minzip/@foxify/events.svg

[MONTHLY_DOWNLOADS_BADGE]: https://img.shields.io/npm/dm/@foxify/events.svg

[TOTAL_DOWNLOADS_BADGE]: https://img.shields.io/npm/dt/@foxify/events.svg

[DEPENDENCY_STATUS_BADGE]: https://david-dm.org/foxifyjs/events.svg

[DEPENDENCY_STATUS_URI]: https://david-dm.org/foxifyjs/events

[OPEN_ISSUES_BADGE]: https://img.shields.io/github/issues-raw/foxifyjs/events.svg

[OPEN_ISSUES_URI]: https://github.com/foxifyjs/events/issues?q=is%3Aopen+is%3Aissue

[PR_BADGE]: https://img.shields.io/badge/PRs-Welcome-brightgreen.svg

[PR_URI]: https://github.com/foxifyjs/events/pulls

[LICENSE_BADGE]: https://img.shields.io/github/license/foxifyjs/events.svg

[LICENSE_URI]: https://github.com/foxifyjs/events/blob/master/LICENSE

[NPM_URI]: https://www.npmjs.com/package/@foxify/events
