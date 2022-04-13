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

  function render(n1, n2, container, parentComponent, anchor) {
    // path
    // path(n1, n2, container, parentComponent, anchor);
    path(n1, n2, container, null, null);
  }

  function path(n1, n2, container, parentComponent, anchor) {
    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        }
        break;
    }
  }

  function processText(n1, n2: any, container: HTMLElement) {
    const textNode = (n2.el = document.createTextNode(n2.children));
    container.append(textNode);
  }

  function processFragment(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    mountChildren(n2.children, container, parentComponent, anchor);
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    // let el = container;
    if (typeof container === "string") {
      container = document.querySelector(container);
    }
    if (n1 === null) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      pathElement(n1, n2, container, parentComponent, anchor);
    }
  }

  function pathElement(n1, n2, container, parentComponent, anchor) {
    // console.log("pathElement");
    // console.log("n1", n1);
    // console.log("n2", n2);
    // console.log(container);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    pathChildren(n1, n2, el, parentComponent, anchor);
    pathProps(el, oldProps, newProps);
  }

  function pathChildren(n1, n2, container, parentComponent, anchor) {
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
          mountChildren(c2, container, parentComponent, anchor);
        }
      } else {
        pathKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  function pathKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0,
      e1 = c1.length - 1,
      e2 = c2.length - 1;
    // 左侧相同
    while (i <= e1 && i <= e2) {
      const prev = c1[i],
        next = c2[i];
      if (isSameVNode(prev, next)) {
        path(prev, next, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }
    // 右侧相同
    while (i <= e1 && i <= e2) {
      const prev = c1[e1],
        next = c2[e2];
      if (isSameVNode(prev, next)) {
        path(prev, next, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // console.log({ i, e1, e2 });
    if (i > e1 && i <= e2) {
      // 新的比老的长（新增）
      while (i <= e2) {
        const anchor = c2[e2 + 1]?.el;
        path(null, c2[i], container, parentComponent, anchor);
        i++;
      }
    } else if (i > e2 && i <= e1) {
      // 老的比新的长（删除）
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      // 中间不同
      // 删除不存在的
      let s1 = i;
      let s2 = i;
      const toBePatched = e2 - s2 + 1;
      let patched = 0;

      let maxNewIndexSoFar = 0;
      let moved = false;
      const newChildIndexMap = new Map();
      const newIndex2OldIndexArray = new Array(toBePatched).fill(0);

      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        nextChild.key && newChildIndexMap.set(nextChild.key, i);
      }

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = newChildIndexMap.get(prevChild.key);
        } else {
          for (let j = 0; j <= e2; j++) {
            const nextChild = c2[j];
            if (isSameVNode(prevChild, nextChild)) {
              newIndex = j;
              break;
            }
          }
        }

        if (newIndex === undefined) {
          hostRemove(prevChild.el);
        } else {
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          newIndex2OldIndexArray[newIndex - s2] = i + 1;
          path(prevChild, c2[newIndex], container, parentComponent, null);
          patched++;
        }
      }

      /**
       * newIndex2OldIndexArray 数组的下标记录着老VNODE的序列
       * newIndex2OldIndexArray 值为0时,代表改元素是新增的,因为遍历旧元素时没有访问过
       * anchor锚点选择从e2的位置,依次往前插入,是稳定的序列
       * 最长增长子序列, 目的是塞选出不需要移动的元素是哪些? `在新数组里面的顺序`
       */
      const increaseNewSeq = moved ? getSequence(newIndex2OldIndexArray) : [];
      let j = 0;
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null;

        if (newIndex2OldIndexArray[i] === 0) {
          path(null, nextChild, container, parentComponent, anchor);
        } else if (moved) {
          if (increaseNewSeq[j] !== i) {
            hostInsert(nextChild.el, container, anchor);
          } else {
            j++;
          }
        }
      }
    }

    function isSameVNode(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
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

  function mountElement(
    vnode,
    container: HTMLHtmlElement,
    parentComponent,
    anchor
  ) {
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
      mountChildren(vnode.children, el, parentComponent, anchor);
    }
    // container.append(el);
    hostInsert(el, container, anchor);
  }

  function mountChildren(children, el, parentComponent, anchor) {
    children.forEach((v) => {
      path(null, v, el, parentComponent, anchor);
    });
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor);
  }

  function mountComponent(initialVNode, container, parentComponent, anchor) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }

  function setupRenderEffect(instance, initialVNode, container, anchor) {
    effect(() => {
      // TODO modify???
      if (!instance.isMounted) {
        console.log("init");
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        path(null, subTree, container, instance, anchor);
        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const prevTree = instance.subTree;
        const nextTree = (instance.subTree = instance.render.call(proxy));
        // todo
        path(prevTree, nextTree, container, instance, anchor);
      }
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}

function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
