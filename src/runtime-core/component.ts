import { shallowReadonly } from "./../reactivity/reactive";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { isObject } from "./../shared/index";
import { initProps } from "./componentProps";
import { emit } from "./componentEmit";
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    get type() {
      return vnode.type;
    },
    setupState: {},
    props: {},
    emit: () => {},
  };

  component.emit = emit.bind(null, component) as any;

  return component;
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
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
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
