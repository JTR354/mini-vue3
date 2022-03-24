import { reactive } from "./../reactive";
import { describe, expect, it } from "vitest";

import { effect } from "./../effect";
import { isRef, ref, unRef } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      dummy = a.value;
      calls++;
    });
    expect(dummy).toBe(1);
    expect(calls).toBe(1);
    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
    // same value shouldn't trigger
    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
  });

  it("should nested", () => {
    const a = ref({ count: 1 });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count++;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const a = ref(1);
    const b = 2;
    const c = reactive({ a: 1 });
    expect(isRef(a)).toBe(true);
    expect(isRef(b)).toBe(false);
    expect(isRef(c)).toBe(false);
  });

  it("unRef", () => {
    const a = ref(1);
    const b = 2;
    const c = reactive({ a: 3 });
    expect(unRef(a)).toBe(1);
    expect(unRef(b)).toBe(2);
    expect(unRef(c)).toBe(c);
  });
});
