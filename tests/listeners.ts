import { EventEmitter } from "../src";

it("returns an empty array if no listeners are specified", () => {
  const e = new EventEmitter();

  expect(e.listeners("foo")).toBeInstanceOf(Array);
  expect(e.listeners("foo").length).toBe(0);
});

it("returns an array of function", () => {
  const e = new EventEmitter();

  function foo() {}

  e.on("foo", foo);

  expect(e.listeners("foo")).toBeInstanceOf(Array);
  expect(e.listeners("foo").length).toBe(1);
  expect(e.listeners("foo")).toEqual([foo]);
});

it("is not vulnerable to modifications", () => {
  const e = new EventEmitter();

  function foo() {}

  e.on("foo", foo);

  expect(e.listeners("foo")).toEqual([foo]);

  e.listeners("foo").length = 0;

  expect(e.listeners("foo")).toEqual([foo]);
});
