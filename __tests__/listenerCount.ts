import EventEmitter from "../src";

it("returns the number of listeners for a given event", () => {
  const e = new EventEmitter();

  expect(e.listenerCount("foo")).toBe(0);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  e.on("foo", function () {});

  expect(e.listenerCount("foo")).toBe(1);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  e.on("foo", function () {});

  expect(e.listenerCount("foo")).toBe(2);
});
