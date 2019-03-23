import { EventEmitter } from "..";

it("returns the number of listeners for a given event", () => {
  const e = new EventEmitter();

  expect(e.listenerCount("foo")).toBe(0);

  e.on("foo", function() {});

  expect(e.listenerCount("foo")).toBe(1);

  e.on("foo", function() {});

  expect(e.listenerCount("foo")).toBe(2);
});
