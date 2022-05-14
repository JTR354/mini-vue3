import { proxyRef } from "./../reactivity/ref";
import { shallowReadonly } from "./../reactivity/reactive";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { isObject } from "./../shared/index";
import { initProps } from "./componentProps";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    next: null,
    get type() {
      return vnode.type;
    },
    setupState: {},
    props: {},
    slots: {},
    emit: () => {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);

  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
}

function setupStatefulComponent(instance) {
  const Component = instance.type;
  const { setup } = Component;
  let setupResult;
  if (setup) {
    setCurrentInstance(instance);
    setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
  }
  handlerSetupResult(instance, setupResult);
}

function handlerSetupResult(instance, setupResult) {
  // TODO function
  if (isObject(setupResult)) {
    instance.setupState = proxyRef(setupResult);
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  // 给 instance 设置 render

  // 先取到用户设置的 component options
  const Component = instance.type;

  if (!instance.render) {
    // 如果 compile 有值 并且当然组件没有 render 函数，那么就需要把 template 编译成 render 函数
    if (compile && !Component.render) {
      if (Component.template) {
        // 这里就是 runtime 模块和 compile 模块结合点
        const template = Component.template;
        Component.render = compile(template);
      }
    }

    instance.render = Component.render;
  }

  // applyOptions()
}

let currentInstance = null;

export function getCurrentInstance() {
  return currentInstance;
}

/**
 * 方便管理
 * @param instance currentInstance
 */
function setCurrentInstance(instance: any) {
  currentInstance = instance;
}

let compile;
export function registerRuntimeCompiler(_compile) {
  compile = _compile;
}
