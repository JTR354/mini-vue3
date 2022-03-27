import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./foo.js";

export const App = {
  render() {
    return h("div", {}, [
      h("div", {}, "App"),
      h(Foo, {
        onAdd(...args) {
          console.log("FOO EMIT", ...args);
        },
        onAddFoo(...args) {
          console.log("add-foo", ...args);
        },
      }),
    ]);
  },
  setup() {
    return {};
  },
};
