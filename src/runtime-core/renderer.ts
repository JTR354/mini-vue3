import { EMPTY_OBJ } from "../shared";
import { effect } from "./../reactivity/effect";
import { ShapeFlags } from "./../shared/ShapeFlags";

import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./creatApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    pathProp: hostPathProp,
    insert: hostInsert,
    setElementText: hostSetElementText,
    remove: hostRemove,
  } = options;

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
    mountChildren(n2.children, container, parentComponent);
  }

  function processElement(n1, n2, container, parentComponent) {
    // let el = container;
    if (typeof container === "string") {
      container = document.querySelector(container);
    }
    if (n1 === null) {
      mountElement(n2, container, parentComponent);
    } else {
      pathElement(n1, n2, container, parentComponent);
    }
  }

  function pathElement(n1, n2, container, parentComponent) {
    console.log("pathElement");
    console.log("n1", n1);
    console.log("n2", n2);
    console.log(container);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    pathChildren(n1, n2, el, parentComponent);
    pathProps(el, oldProps, newProps);
  }

  function pathChildren(n1, n2, container, parentComponent) {
    const { shapeFlag: prevShapeFlag, children: c1 } = n1;
    const { shapeFlag: nextShapeFlag, children: c2 } = n2;

    // array -> text
    // text -> text
    // text -> array
    // array -> array

    // 以next vnode 为视角切入!
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        debugger;
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          hostSetElementText(container, "");
          mountChildren(c2, container, parentComponent);
        }
      }
    }
  }

  function unmountChildren(children: any) {
    for (let { el } of children) {
      hostRemove(el);
    }
  }

  function pathProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (let key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== newProps) {
          hostPathProp(el, key, prevProp, nextProp);
        }
      }
    }
    if (oldProps !== EMPTY_OBJ) {
      for (let key in oldProps) {
        if (!newProps[key]) {
          hostPathProp(el, key, oldProps[key], null);
        }
      }
    }
  }

  function mountElement(vnode, container: HTMLHtmlElement, parentComponent) {
    const { type, props, shapeFlag } = vnode;
    // createElement
    const el: HTMLHtmlElement = (vnode.el = hostCreateElement(type));

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
      hostPathProp(el, key, null, value);
    }
    if (ShapeFlags.TEXT_CHILDREN & shapeFlag) {
      // el.textContent = vnode.children;
      hostSetElementText(el, vnode.children);
    } else if (ShapeFlags.ARRAY_CHILDREN & shapeFlag) {
      mountChildren(vnode.children, el, parentComponent);
    }
    // container.append(el);
    hostInsert(el, container);
  }

  function mountChildren(children, el, parentComponent) {
    children.forEach((v) => {
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
      // TODO modify???
      if (!instance.isMounted) {
        console.log("init");
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        path(null, subTree, container, instance);
        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const prevTree = instance.subTree;
        const nextTree = (instance.subTree = instance.render.call(proxy));
        path(prevTree, nextTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
