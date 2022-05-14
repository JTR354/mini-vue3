import { describe, it, expect, test } from "vitest";
import { generate } from "../src/codegen";
import { transform } from "../src/transform";
import { baseParse } from "../src/parse";
import { transformElement } from "../src/transforms/transformElement";
import { transformExpression } from "../src/transforms/transformExpression";
import { transformText } from "../src/transforms/transformText";

describe("codegen", () => {
  it("string", () => {
    let ast: any = baseParse("hi");
    transform(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  it("interpolation module", () => {
    const ast = baseParse("{{hello}}");
    transform(ast, {
      nodeTransforms: [transformExpression],
    });

    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  it("element and interpolation", () => {
    const ast = baseParse("<div>hi,{{msg}}</div>");
    transform(ast, {
      nodeTransforms: [transformElement, transformText, transformExpression],
    });

    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});
