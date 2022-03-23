import { describe, expect, vi, test, it } from "vitest";

import { isReadonly, readonly } from "../reactive";

describe("readonly", () => {
  test("happy path", () => {
    const original = { foo: 1 };
    const wrapped = readonly(original);
    console.warn = vi.fn();
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
    wrapped.foo = 2;
    expect(console.warn).toBeCalled();
    expect(wrapped.foo).toBe(1);
    // isReadonly
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  });

  it("nested readonly", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = readonly(original);
    expect(isReadonly(observed.nested)).toBe(true);
    expect(isReadonly(observed.array)).toBe(true);
    expect(isReadonly(observed.array[0])).toBe(true);
  });
});
