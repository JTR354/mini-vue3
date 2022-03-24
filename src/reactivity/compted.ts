import { ReactiveEffect } from "./effect";

class ComputedImpl {
  private _dirt: any = true;
  private _value;
  private _effect: ReactiveEffect;
  constructor(getter) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirt) {
        this._dirt = true;
      }
    });
  }
  get value() {
    if (this._dirt) {
      this._dirt = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}
export const computed = (getter) => {
  return new ComputedImpl(getter);
};
