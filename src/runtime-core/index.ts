// export const h = (type, props?, children?) => {
//   return createVNode(type, props, children);
// };

// function createVNode(type, props, children) {
//   return {
//     type,
//     props,
//     children,
//   };
// }

// export const createApp = (rootComponent) => {
//   return {
//     mount(container) {
//       const context = rootComponent.setup();
//       const vnode = rootComponent.render.call(context);
//       const { type, props, children } = vnode;
//       const el: HTMLElement = document.createElement(type);
//       el.textContent = children;
//       for (let key in props) {
//         let value = props[key];
//         if (Array.isArray(value)) {
//           value = value.join(" ");
//         }
//         el.setAttribute(key, value);
//       }
//       const root: HTMLElement = document.querySelector(container);
//       root.append(el);
//     },
//   };
// };

// export { createApp } from "./creatApp";
// export { h } from "./h";
export * from "./h";
// export * from "./createApp";
export { renderSlots } from "./helpers/renderSlots";
export { createTextVNode, createElementVNode } from "./vnode";
export { getCurrentInstance, registerRuntimeCompiler } from "./component";
export { inject, provide } from "./apiInject";
export { createRenderer } from "./renderer";
export { nextTick } from "./scheduler";
export { toDisplayString } from "../shared";
