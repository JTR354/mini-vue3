import { createApp, h, ref } from "../../lib/mini-vue.esm.js";

const App = {
  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };
    return {
      count,
      onClick,
    };
  },
  render() {
    const button = h("button", { onClick: this.onClick }, "add");
    const p = h("p", {}, `count:${this.count}`);
    return h("div", {}, [p, button]);
  },
};

createApp(App).mount("#app");
