import { describe, it, expect, test } from "vitest";
import { NodeTypes } from "./../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", () => {
  describe("interpolation", () => {
    it("simple interpolation", () => {
      const ast: any = baseParse("{{ message }}");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });

  describe("element", () => {
    it("simple element", () => {
      const ast: any = baseParse("<div></div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [],
      });
    });
  });

  describe("text", () => {
    it("simple text", () => {
      const ast: any = baseParse("some text");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some text",
      });
    });
  });

  test("hello world", () => {
    const ast: any = baseParse("<div>h1,{{message}}</div>");
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: "div",
      children: [
        {
          type: NodeTypes.TEXT,
          content: "h1,",
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: "message",
          },
        },
      ],
    });
  });

  test.only("nested element", () => {
    const ast: any = baseParse(
      "<div><p><span>h1,</span><span>h2</span></p>{{message}}</div>"
    );
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: "div",
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: "p",
          children: [
            {
              type: NodeTypes.ELEMENT,
              tag: "span",
              children: [
                {
                  type: NodeTypes.TEXT,
                  content: "h1,",
                },
              ],
            },
            {
              type: NodeTypes.ELEMENT,
              tag: "span",
              children: [
                {
                  type: NodeTypes.TEXT,
                  content: "h2",
                },
              ],
            },
          ],
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: "message",
          },
        },
      ],
    });
  });

  test("throw error when miss lack element tag", () => {
    expect(() => {
      baseParse("<div><span></div>");
    }).throw(`缺少标签span`);
  });
});
