import { effect } from "./../reactivity/effect";
import { ShapeFlags } from "./../shared/ShapeFlags";

import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./creatApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement, pathProp, insert, setElementText } = options;

  function render(n1, n2, container, parentComponent) {
    // path
    path(n1, n2, container, parentComponent);
  }

  function path(n1, n2, container, parentComponent) {
    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processText(n1, n2: any, container: HTMLElement) {
    const textNode = (n2.el = document.createTextNode(n2.children));
    container.append(textNode);
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }

  function processElement(n1, n2, container, parentComponent) {
    // let el = container;
    if (typeof container === "string") {
      container = document.querySelector(container);
    }
    if (n1 === null) {
      mountElement(n2, container, parentComponent);
    } else {
      pathElement(n1, n2, container);
    }
  }

  function pathElement(n1, n2, container) {
    console.log("pathElement");
    console.log("n1", n1);
    console.log("n2", n2);
    console.log(container);
  }

  function mountElement(vnode, container: HTMLHtmlElement, parentComponent) {
    const { type, props, shapeFlag } = vnode;
    // createElement
    const el: HTMLHtmlElement = (vnode.el = createElement(type));

    for (const key in props) {
      let value = props[key];
      // if (key === "class" && Array.isArray(value)) {
      //   value = value.join(" ");
      // }
      // if (isOn(key)) {
      //   const event = key.slice(2).toLocaleLowerCase();
      //   el.addEventListener(event, value);
      // } else {
      //   el.setAttribute(key, value);
      // }
      pathProp(key, value, el);
    }
    if (ShapeFlags.TEXT_CHILDREN & shapeFlag) {
      // el.textContent = vnode.children;
      setElementText(el, vnode.children);
    } else if (ShapeFlags.ARRAY_CHILDREN & shapeFlag) {
      mountChildren(vnode, el, parentComponent);
    }
    // container.append(el);
    insert(el, container);
  }

  function mountChildren(vnode, el, parentComponent) {
    vnode.children.forEach((v) => {
      path(null, v, el, parentComponent);
    });
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        path(null, subTree, container, instance);
        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        path(prevSubTree, subTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
