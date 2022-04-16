import { NodeTypes } from "./ast";

enum TagTypes {
  START,
  END,
}

export function baseParse(content: string) {
  const context = createContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  const result: any[] = [];
  const s = context.source;
  if (s.startsWith("{{")) {
    result.push(parseInterpolation(context));
  } else if (s.startsWith("<")) {
    result.push(parseElement(context));
  }
  return result;
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const source = context.source;
  const closeIndex = source.indexOf(closeDelimiter);
  const rawContent = source.slice(openDelimiter.length, closeIndex);
  advanceBy(context, closeIndex + closeDelimiter.length);
  // console.log(context);
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
function parseElement(context: any): any {
  const element = parseTag(context, TagTypes.START);
  parseTag(context, TagTypes.END);
  return element;
}
function parseTag(context: any, type: TagTypes) {
  const match = context.source.match(/^<\/?([a-z]*)/i);
  const tag = match[1];
  advanceBy(context, match[0].length + 1);
  // console.log(context);
  if (type === TagTypes.END) return;
  return {
    type: NodeTypes.ELEMENT,
    content: {
      tag,
    },
  };
}
