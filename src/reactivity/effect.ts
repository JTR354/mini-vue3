import { extend } from './../shared/index';

// TODO 为啥用全局? targetMap & activeEffect
const targetMap = new Map();
let activeEffect;
let shouldTrack = true
class ReactiveEffect {
  private _fn: () => {};
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    shouldTrack = true
    activeEffect = this;
    return this._fn();
  }
  stop() {
    shouldTrack = false
    if (this.active) {
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

export const track = (target, key) => {
  // if (!activeEffect) return;
  // if (!shouldTrack) return;
  if (!isTracking()) return
  // target -> key -> dep
  let desMap = targetMap.get(target);
  if (!desMap) {
    desMap = new Map();
    targetMap.set(target, desMap);
  }

  let dep = desMap.get(key);
  if (!dep) {
    dep = new Set();
    desMap.set(key, dep);
  }
  
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
};

function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export const trigger = (target, key) => {
  const desMap = targetMap.get(target);
  if (!desMap) return
  const dep = desMap.get(key);
  for (let effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

export const effect = (fn, options: any = {}) => {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  extend(_effect, options)
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};

export const stop = (runner) => {
  runner.effect.stop();
};
