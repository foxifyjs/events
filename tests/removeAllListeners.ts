import { EventEmitter } from "..";

it("removes all events for the specified events", () => {
  const e = new EventEmitter();

  e.on("foo", () => {
    throw new Error("oops");
  });
  e.on("foo", () => {
    throw new Error("oops");
  });
  e.on("bar", () => {
    throw new Error("oops");
  });
  e.on("aaa", () => {
    throw new Error("oops");
  });

  expect(e.removeAllListeners("foo")).toEqual(e);
  expect(e.listeners("foo").length).toBe(0);
  expect(e.listeners("bar").length).toBe(1);
  expect(e.listeners("aaa").length).toBe(1);

  expect(e.removeAllListeners("bar")).toEqual(e);
  expect(e.removeAllListeners("aaa")).toEqual(e);

  expect(e.emit("foo")).toBe(false);
  expect(e.emit("bar")).toBe(false);
  expect(e.emit("aaa")).toBe(false);
});

it("removes all events, literally!", () => {
  const e = new EventEmitter();

  e.on("foo", () => {
    throw new Error("oops");
  });
  e.on("foo", () => {
    throw new Error("oops");
  });
  e.on("bar", () => {
    throw new Error("oops");
  });
  e.on("aaa", () => {
    throw new Error("oops");
  });

  expect(e.removeAllListeners()).toEqual(e);
  expect(e.listeners("foo").length).toBe(0);
  expect(e.listeners("bar").length).toBe(0);
  expect(e.listeners("aaa").length).toBe(0);

  expect(e.emit("foo")).toBe(false);
  expect(e.emit("bar")).toBe(false);
  expect(e.emit("aaa")).toBe(false);
});
