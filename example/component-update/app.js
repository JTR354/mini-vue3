import { h, ref } from "../../lib/mini-vue.esm.js";

const Child = {
  name: "Child",
  render() {
    return h("div", {}, this.$props.msg);
  },
};

export default {
  name: "App",
  setup() {
    const msg = ref("123");
    window.msg = msg;
    const updateChild = () => {
      msg.value = "456";
    };
    const count = ref(0);
    const updateSelf = () => {
      count.value++;
    };
    return {
      msg,
      count,
      updateChild,
      updateSelf,
    };
  },
  render() {
    return h("div", {}, [
      h("button", { onClick: this.updateChild }, "update child component"),
      h(Child, { msg: this.msg }),
      h("button", { onClick: this.updateSelf }, "update myself"),
      h("p", {}, `count: ${this.count}`),
    ]);
  },
};
