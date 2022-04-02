import { createApp, h, ref } from "../../lib/mini-vue.esm.js";

const App = {
  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };
    const props = ref({
      foo: "foo",
      bar: "bar",
    });
    // 修改
    // 删除
    //  1.foo -> undefine null
    //  2.bar -> 没有该属性
    const onClickChanged = () => {
      props.value.foo = "new-foo";
    };
    const onClickNull = () => {
      props.value.foo = undefined;
    };
    const onClickBar = () => {
      props.value = { foo: "foo" };
    };

    return {
      count,
      props,
      onClick,
      onClickChanged,
      onClickNull,
      onClickBar,
    };
  },
  render() {
    const button = h("button", { onClick: this.onClick }, "add");
    const button1 = h(
      "button",
      { onClick: this.onClickChanged },
      "修改foo -> new-foo"
    );
    const button2 = h(
      "button",
      { onClick: this.onClickNull },
      "foo -> undefined"
    );
    const button3 = h("button", { onClick: this.onClickBar }, "bar -> 不存在");
    const p = h("p", {}, `count:${this.count}`);
    return h("div", { id: "root", ...this.props }, [
      p,
      button,
      button1,
      button2,
      button3,
    ]);
  },
};

createApp(App).mount("#app");
