import { it, describe, expect } from "vitest";

import { isReactive, reactive } from "../reactive";

describe('reactive', () => {
  it('happy path', () => {
    const original = {foo:1}
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
    observed.foo = 2
    expect(observed.foo).toBe(2)
    // isReactive
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
  });
});