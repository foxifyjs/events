import EventEmitter from "../src";

it("removes only the first listener matching the specified listener", () => {
  const e = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function foo() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function bar() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function baz() {}

  e.on("foo", foo);
  e.on("bar", bar);
  e.on("bar", baz);

  expect(e.removeListener("foo", bar)).toEqual(e);
  expect(e.listeners("bar")).toEqual([bar, baz]);
  expect(e.listeners("foo")).toEqual([foo]);

  expect(e.removeListener("foo", foo)).toEqual(e);
  expect(e.listeners("bar")).toEqual([bar, baz]);
  expect(e.listeners("foo")).toEqual([]);

  expect(e.removeListener("bar", bar)).toEqual(e);
  expect(e.listeners("bar")).toEqual([baz]);

  expect(e.removeListener("bar", baz)).toEqual(e);
  expect(e.listeners("bar")).toEqual([]);

  e.on("foo", foo);
  e.on("foo", foo);
  e.on("bar", bar);

  expect(e.removeListener("foo", foo)).toEqual(e);
  expect(e.listeners("bar")).toEqual([bar]);
  expect(e.listeners("foo")).toEqual([]);
});

it("should not fail if the events don't exist", () => {
  const e = new EventEmitter();

  expect(e.removeListener("not-found", () => 1)).toEqual(e);
});
