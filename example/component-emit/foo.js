import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log("emitAdd");
      emit("add", 1, 3, 4);
      emit("add-foo", 66);
    };
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h("button", { onClick: this.emitAdd }, "add emit button");
    const foo = h("span", {}, "this is a foo");
    return h("div", {}, [btn, foo]);
  },
};
