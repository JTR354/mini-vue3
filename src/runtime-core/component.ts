import { shallowReadonly } from "./../reactivity/reactive";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { isObject } from "./../shared/index";
import { initProps } from "./componentProps";
export function createComponentInstance(vnode) {
  return {
    vnode,
    get type() {
      return vnode.type;
    },
  };
}

export function setupComponent(instance) {
  // init props
  initProps(instance, instance.vnode.props);
  // TODO init slot

  setupStatefulComponent(instance);

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
}

function setupStatefulComponent(instance) {
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props));
    handlerSetupResult(instance, setupResult);
  }
}

function handlerSetupResult(instance, setupResult) {
  // TODO function
  // Object
  if (isObject(setupResult)) {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
