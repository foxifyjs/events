const { Suite } = require("benchmark");
const { EventEmitter } = require("events");
const { EventEmitter2 } = require("eventemitter2");
const EventEmitter3 = require("eventemitter3");
const { EventEmitter: DripEmitter } = require("drip");
const FoxifyEmitter = require("..").default;

function handle() {
  return 1;
}

const eventEmitter = new EventEmitter();
const eventEmitter2 = new EventEmitter2();
const eventEmitter3 = new EventEmitter3();
const dripEmitter = new DripEmitter();
const foxifyEmitter = new FoxifyEmitter();

for (i = 0; i < 10; i++) {
  for (j = 0; j < 10; j++) {
    eventEmitter.on(`event:${i}`, handle);
    eventEmitter2.on(`event:${i}`, handle);
    eventEmitter3.on(`event:${i}`, handle);
    dripEmitter.on(`event:${i}`, handle);
    foxifyEmitter.on(`event:${i}`, handle);
  }
}

new Suite()
  .add("events", () => {
    for (i = 0; i < 10; i++) {
      eventEmitter.emit(`event:${i}`);
    }
  })
  .add("@foxify/events", () => {
    for (i = 0; i < 10; i++) {
      foxifyEmitter.emit(`event:${i}`);
    }
  })
  .add("eventemitter2", () => {
    for (i = 0; i < 10; i++) {
      eventEmitter2.emit(`event:${i}`);
    }
  })
  .add("eventemitter3", () => {
    for (i = 0; i < 10; i++) {
      eventEmitter3.emit(`event:${i}`);
    }
  })
  .add("drip", () => {
    for (i = 0; i < 10; i++) {
      dripEmitter.emit(`event:${i}`);
    }
  })
  .on("cycle", (e) => {
    console.log(e.target.toString());
  })
  .on("complete", function onComplete() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run();
