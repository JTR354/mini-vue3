// 最简单的情况
// template 只有一个 interpolation
// export default {
//   template: `{{msg}}`,
//   setup() {
//     return {
//       msg: "vue3 - compiler",
//     };
//   },
// };

// 复杂一点
// template 包含 element 和 interpolation
import { ref } from "../../lib/mini-vue.esm.js";
export default {
  template: `<p>{{msg}}{{count}}</p>`,
  setup() {
    const count = ref(0);
    window.count = count;
    return {
      msg: "vue3 - compiler",
      count,
    };
  },
};
