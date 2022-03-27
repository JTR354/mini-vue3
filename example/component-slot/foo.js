import { h, renderSlots } from "../../lib/mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  render() {
    // Foo. vnode .children
    const foo = h("p", {}, "foo");
    // return h("div", {}, [foo, h("div", {}, this.$slots)]); renderSlots
    // 具名插槽
    // 作用域插槽
    return h("div", { class: "foo" }, [
      renderSlots(this.$slots, "header", { age: 18 }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
