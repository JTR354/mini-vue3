import { readonly } from "../reactive";

describe('readonly', () => {
  test('happy path', () => {
    const original = {foo:1}
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
  });
});