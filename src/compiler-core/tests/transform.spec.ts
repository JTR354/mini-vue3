import { describe, it, expect } from "vitest";
import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

describe("transform", () => {
  it("happy path", () => {
    const ast = baseParse("<div>h1,{{message}}</div>");
    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content + "mini-vue";
      }
    };
    transform(ast, {
      nodeTransform: [plugin],
    });
    const textContent = ast.children[0].children[0].content;
    expect(textContent).toBe("h1,mini-vue");
  });
});
