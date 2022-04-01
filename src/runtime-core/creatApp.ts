// import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // vnode
        // render
        const vnode = createVNode(rootComponent);

        render(null, vnode, rootContainer, null);
      },
    };
  };
}
