import { ShapeFlags } from "./../shared/ShapeFlags";

import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // path
  path(vnode, container);
}

function path(vnode, container) {
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  } else if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  }
}

function processElement(vnode, container) {
  let el = container;
  if (typeof container === "string") {
    el = document.querySelector(container);
  }
  mountElement(vnode, el);
}

function mountElement(vnode, container: HTMLHtmlElement) {
  const { type, props, children } = vnode;
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
  mountChildren(children, el, vnode);
  container.append(el);
}

function mountChildren(children: any, el: HTMLHtmlElement, vnode) {
  const { shapeFlag } = vnode;
  if (ShapeFlags.TEXT_CHILDREN & shapeFlag) {
    el.textContent = children;
  } else if (ShapeFlags.ARRAY_CHILDREN & shapeFlag) {
    // TODO child is a string
    children.forEach((child) => {
      path(child, el);
      // mountChildren(child, el, vnode);
    });
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  path(subTree, container);
  // element -> mount
  initialVNode.el = subTree.el;
}
