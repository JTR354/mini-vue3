import { ShapeFlags } from "./../shared/ShapeFlags";

import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container, parentComponent) {
  // path
  path(vnode, container, parentComponent);
}

function path(vnode, container, parentComponent) {
  const { shapeFlag, type } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;

    default:
      if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      } else if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      }
      break;
  }
}

function processText(vnode: any, container: HTMLElement) {
  const textNode = (vnode.el = document.createTextNode(vnode.children));
  container.append(textNode);
}

function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent);
}

function processElement(vnode, container, parentComponent) {
  let el = container;
  if (typeof container === "string") {
    el = document.querySelector(container);
  }
  mountElement(vnode, el, parentComponent);
}

function mountElement(vnode, container: HTMLHtmlElement, parentComponent) {
  const { type, props, shapeFlag } = vnode;
  const el: HTMLHtmlElement = (vnode.el = document.createElement(type));

  const isOn = (key) => /^on[A-Z]/.test(key);
  for (const key in props) {
    let value = props[key];
    if (key === "class" && Array.isArray(value)) {
      value = value.join(" ");
    }
    if (isOn(key)) {
      const event = key.slice(2).toLocaleLowerCase();
      el.addEventListener(event, value);
    } else {
      el.setAttribute(key, value);
    }
  }
  if (ShapeFlags.TEXT_CHILDREN & shapeFlag) {
    el.textContent = vnode.children;
  } else if (ShapeFlags.ARRAY_CHILDREN & shapeFlag) {
    mountChildren(vnode, el, parentComponent);
  }
  container.append(el);
}

function mountChildren(vnode, el, parentComponent) {
  vnode.children.forEach((child) => {
    path(child, el, parentComponent);
  });
}

function processComponent(vnode, container, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(initialVNode, container, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  path(subTree, container, instance);
  // element -> mount
  initialVNode.el = subTree.el;
}
