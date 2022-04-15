import { NodeTypes } from "./ast";

const openDelimiter = "{{";

export function baseParse(content: string) {
  const context = createContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  const result: any[] = [];
  if (context.source.startsWith(openDelimiter)) {
    result.push(parseInterpolation(context));
  }
  return result;
}

function parseInterpolation(context) {
  // const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const source = context.source;
  const closeIndex = source.indexOf(closeDelimiter);
  const rawContent = source.slice(openDelimiter.length, closeIndex);
  advance(context, closeIndex + closeDelimiter.length);
  console.log(context);
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: rawContent.trim(),
    },
  };
}

function advance(context: any, index: number) {
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
