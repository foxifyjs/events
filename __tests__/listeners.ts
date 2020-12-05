import EventEmitter from "../src";

it("returns an empty array if no listeners are specified", () => {
  const e = new EventEmitter();

  expect(e.listeners("foo")).toBeInstanceOf(Array);
  expect(e.listeners("foo").length).toBe(0);
});

it("returns an array of function", () => {
  const e = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function foo() {}

  e.on("foo", foo);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function bar() {}

  e.on("foo", bar);

  const listeners = e.listeners("foo");

  expect(listeners).toBeInstanceOf(Array);
  expect(listeners.length).toBe(2);
  expect(listeners).toEqual([foo, bar]);
});

it("is not vulnerable to modifications", () => {
  const e = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function foo() {}

  e.on("foo", foo);

  expect(e.listeners("foo")).toEqual([foo]);

  e.listeners("foo").length = 0;

  expect(e.listeners("foo")).toEqual([foo]);
});
