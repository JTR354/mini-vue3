import typescript from "@rollup/plugin-typescript";
export default {
  input: "./src/index.ts",
  output: [
    {
      format: "es",
      file: "lib/mini-vue.esm.js",
    },
    {
      format: "cjs",
      file: "lib/mini-vue.cjs.js",
    },
  ],
  plugins: [typescript()],
};
