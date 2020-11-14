import { EventEmitter } from "../src";

it("returns an empty array when there are no events", () => {
  const e = new EventEmitter();

  expect(e.eventNames()).toEqual([]);

  e.on("foo", () => {});
  e.removeAllListeners("foo");

  expect(e.eventNames()).toEqual([]);
});

it("returns an array listing the events that have listeners", () => {
  const e = new EventEmitter();

  function bar() {}

  e.on("foo", () => {});
  e.on("bar", bar);

  try {
    expect(e.eventNames()).toEqual(["foo", "bar"]);
    e.removeListener("bar", bar);
    expect(e.eventNames()).toEqual(["foo"]);
  } catch (ex) {
    throw ex;
  }
});
