import { getCurrentInstance, h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log(Foo.name, instance);
  },
  render() {
    return h("div", {}, "foo");
  },
};
