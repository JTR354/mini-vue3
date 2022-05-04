import { describe, it, expect } from "vitest";
import { generate } from "../src/codegen";
import { transform } from "../src/transform";
import { baseParse } from "../src/parse";

describe("codegen", () => {
  it("string", () => {
    let ast: any = baseParse("hi");
    transform(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});
