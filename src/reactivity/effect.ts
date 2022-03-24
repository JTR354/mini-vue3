import { extend } from "./../shared/index";

// TODO 为啥用全局? targetMap & activeEffect
const targetMap = new Map();
let activeEffect;
let shouldTrack = false;
class ReactiveEffect {
  private _fn: () => {};
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn: () => {}, public scheduler?: any) {
    this._fn = fn;
  }
  run() {
    /**
     * 依赖只会收集一次
     */
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;

    const result = this._fn();

    // reset
    shouldTrack = false;
    activeEffect = undefined;
    return result;
  }
  stop() {
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
  effect.deps.length = 0;
}

export const track = (target, key) => {
  // if (!activeEffect) return;
  // if (!shouldTrack) return;
  if (!isTracking()) return;
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

  trackEffect(dep);
};

export function trackEffect(dep) {
  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export const trigger = (target, key) => {
  const depsMap = targetMap.get(target);

  if (!depsMap) return;

  const dep = depsMap.get(key);
  for (let effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

export function triggerEffect(dep) {
  for (let effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export const effect = (fn, options: any = {}) => {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  extend(_effect, options);
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};

export const stop = (runner) => {
  runner.effect.stop();
};
