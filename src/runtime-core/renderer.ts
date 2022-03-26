import { isObject } from "./../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // path
  path(vnode, container);
}

function path(vnode, container) {
  if (isObject(vnode.type)) {
    processComponent(vnode, container);
  } else if (typeof vnode.type === "string") {
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
  const el: HTMLHtmlElement = document.createElement(type);
  for (const key in props) {
    let value = props[key];
    if (key === "class" && Array.isArray(value)) {
      value = value.join(" ");
    }
    el.setAttribute(key, value);
  }
  mountChildren(children, el);
  container.append(el);
}

function mountChildren(children: any, el: HTMLHtmlElement) {
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach((child) => {
      mountChildren(child, el);
    });
  } else if (isObject(children)) {
    path(children, el);
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render.call(instance.setupState);
  path(subTree, container);
}
