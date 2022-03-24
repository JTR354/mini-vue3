const h = (type, props, children) => {
    return createVNode(type, props, children);
};
function createVNode(type, props, children) {
    return {
        type,
        props,
        children,
    };
}
const createApp = (rootComponent) => {
    return {
        mount(container) {
            const { type, props, children } = rootComponent;
            const el = document.createElement(type);
            el.textContent = children;
            for (let key of props) {
                el.setAttribute(key, props[key]);
            }
            const root = document.querySelector(container);
            root.append(el);
        },
    };
};

export { createApp, h };
