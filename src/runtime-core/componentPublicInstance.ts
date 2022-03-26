const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // setupState
    // $el
    if (key in instance.setupState) {
      return instance.setupState[key];
    }
    const handler = publicPropertiesMap[key];
    if (handler) {
      return handler(instance);
    }
  },
};
