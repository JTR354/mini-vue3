import { getCurrentInstance, h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./foo.js";

export const App = {
  name: "App",
  setup() {
    const instance = getCurrentInstance();
    console.log(App.name, instance);
  },
  render() {
    return h("div", {}, [h("h1", {}, "app"), h(Foo)]);
  },
};
