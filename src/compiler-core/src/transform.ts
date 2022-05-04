export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);

  createRootCodegen(root);
}

function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}

function traverseNode(node, context) {
  const { nodeTransform } = context;
  for (const fn of nodeTransform) {
    fn(node);
  }
  const children = node.children;

  if (children) {
    for (const child of children) {
      traverseNode(child, context);
    }
  }
}

function createTransformContext(root, options) {
  return {
    root,
    nodeTransform: options.nodeTransform || [],
  };
}
