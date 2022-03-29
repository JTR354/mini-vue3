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

export { createApp } from "./creatApp";
export { h } from "./h";
export { renderSlots } from "./helpers/renderSlots";
export { createTextVNode } from "./vnode";
export { getCurrentInstance } from "./component";
