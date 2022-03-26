import { h } from "../lib/mini-vue.esm.js";
import { Foo } from "./foo.js";
window.self = null;
const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "blue"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mouse down");
        },
      },
      [h("p", {}, "hello world " + this.msg), h(Foo, { count: 10 })]
      // [
      //   h("p", {}, "hello world " + this.msg),
      //   h("p", { class: "black" }, "this is a child component"),
      // ]
    );
  },
  setup() {
    return {
      msg: "mini-vue3-hah",
    };
  },
};

export default App;
