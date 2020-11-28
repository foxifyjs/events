import EventEmitter from "../src";

it("returns an empty array when there are no events", () => {
  const e = new EventEmitter();

  expect(e.eventNames()).toEqual([]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  e.on("foo", () => {});
  e.removeAllListeners("foo");

  expect(e.eventNames()).toEqual([]);
});

it("returns an array listing the events that have listeners", () => {
  const e = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function bar() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  e.on("foo", () => {});
  e.on("bar", bar);

  expect(e.eventNames()).toEqual(["foo", "bar"]);
  e.removeListener("bar", bar);
  expect(e.eventNames()).toEqual(["foo"]);
});
