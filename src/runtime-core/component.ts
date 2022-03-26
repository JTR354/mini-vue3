import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { isObject } from "./../shared/index";
export function createComponentInstance(vnode) {
  return {
    vnode,
    get type() {
      return vnode.type;
    },
  };
}

export function setupComponent(instance) {
  // TODO init props
  // TODO init slot

  setupStatefulComponent(instance);

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
}

function setupStatefulComponent(instance) {
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    const setupResult = setup();
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
