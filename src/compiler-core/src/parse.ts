import { NodeTypes } from "./ast";

enum TagTypes {
  START,
  END,
}

export function baseParse(content: string) {
  const context = createContext(content);
  return createRoot(parseChildren(context, []));
}

function parseChildren(context, ancestor) {
  const result: any[] = [];
  while (!isEnd(context)) {
    const s = context.source;
    if (s.startsWith("{{")) {
      result.push(parseInterpolation(context));
    } else if (s.startsWith("<")) {
      result.push(parseElement(context, ancestor));
    } else {
      result.push(parseText(context));
    }
  }

  return result;
}

function isEnd(context) {
  const s = context.source;
  if (s.startsWith("</")) {
    return true;
  }
  return !s;
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const source = context.source;
  advanceBy(context, openDelimiter.length);
  const closeIndex = source.indexOf(closeDelimiter);
  const rawContentLength = closeIndex - closeDelimiter.length;
  const rawContent = parseTextData(context, rawContentLength);
  // console.log(context, parseInterpolation.name, 1);
  advanceBy(context, closeDelimiter.length);
  // console.log(context, parseInterpolation.name, 2);
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: rawContent.trim(),
    },
  };
}

function advanceBy(context: any, index: number) {
  context.source = context.source.slice(index);
}

function createRoot(children: any[]) {
  return {
    children,
  };
}

function createContext(content: string) {
  return {
    source: content,
  };
}
function parseElement(context: any, ancestor): any {
  const element: any = parseTag(context, TagTypes.START);
  ancestor.push(element.tag);
  element.children = parseChildren(context, ancestor);
  const tag = parseTag(context, TagTypes.END);
  if (ancestor.pop() !== tag) {
    throw new Error(`缺少标签${"span"}`);
  }
  return element;
}
function parseTag(context: any, type: TagTypes) {
  const match = context.source.match(/^<\/?([a-z]*)/i);
  // console.log(match, "parseTag", context);
  const tag = match[1];
  advanceBy(context, match[0].length + 1);
  // console.log(context);
  if (type === TagTypes.END) return tag;
  return {
    type: NodeTypes.ELEMENT,
    tag,
    children: [],
  };
}
function parseText(context: any): any {
  const endToken = ["</", "{{"];
  let endIndex = context.source.length;

  for (const token of endToken) {
    const index = context.source.indexOf(token);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }

  const content = parseTextData(context, endIndex);
  // console.log(context, "parse text");
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context, length: number) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
}
