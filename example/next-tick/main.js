import {
  createApp,
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from "../../lib/mini-vue.esm.js";

const App = {
  name: "App",
  setup() {
    const count = ref(0);
    const onClick = () => {
      setTimeout(() => {
        count.value++;
      }, -1);
      for (let index = 0; index < 100; index++) {
        count.value = index;
      }

      console.log(instance.vnode.el.innerText);
      nextTick(() => {
        console.log(instance.vnode.el.innerText);
      });
    };
    const instance = getCurrentInstance();
    return {
      count,
      onClick,
    };
  },
  render() {
    return h("div", {}, [
      h("button", { onClick: this.onClick }, "run"),
      h("p", {}, `count => ${this.count}`),
    ]);
  },
};

createApp(App).mount("#app");
