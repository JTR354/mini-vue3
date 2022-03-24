export const h = (type, props?, children?) => {
  return createVNode(type, props, children);
};

function createVNode(type, props, children) {
  return {
    type,
    props,
    children,
  };
}

export const createApp = (rootComponent) => {
  return {
    mount(container) {
      const { type, props, children } = rootComponent;
      const el: HTMLElement = document.createElement(type);
      el.textContent = children;
      for (let key of props) {
        el.setAttribute(key, props[key]);
      }
      const root: HTMLElement = document.querySelector(container);
      root.append(el);
    },
  };
};
