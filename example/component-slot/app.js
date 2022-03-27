import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./foo.js";
export const App = {
  name: "App",
  render() {
    const app = h("h3", {}, "App");
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => h("p", {}, "this is a foo slot 123" + age),
        footer: () => h("p", {}, "456"),
      }
    );
    return h("div", {}, [app, foo]);
  },
};
