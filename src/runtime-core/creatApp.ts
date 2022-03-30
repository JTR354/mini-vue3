import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // vnode
      // render

      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer, null);
    },
  };
}
