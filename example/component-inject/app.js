import { createApp, h, provide, inject } from "../../lib/mini-vue.esm.js";

const ProviderOne = {
  name: "ProvideOne",
  setup() {
    provide("foo", "foo");
    provide("bar", "bar");
    // provide("baz", "baz");
  },
  render() {
    return h("div", {}, [h("span", {}, ProviderOne.name), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  name: "ProvideTwo",
  setup() {
    provide("foo", "fooTwo");
    // provide("bar", "bar");
    provide("baz", "baz");
    const foo = inject("foo");
    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [
      h("span", {}, ProviderTwo.name + "->"),
      h("span", {}, this.foo),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz");
    const hello = inject("hello", () => "default hello");
    return {
      foo,
      bar,
      baz,
      hello,
    };
  },
  render() {
    return h("div", {}, [
      h("span", {}, "Consumer -> "),
      h("span", {}, `${this.foo}-${this.bar}-${this.baz}-${this.hello}`),
    ]);
  },
};

const App = {
  setup() {},
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(ProviderOne)]);
  },
};

createApp(App).mount("#app");
