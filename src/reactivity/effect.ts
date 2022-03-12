class ReactiveEffect{
  private _fn: () => {}
  constructor(fn){
    this._fn = fn
  }
  run() {
    activeEffect = this
    this._fn()
  }
}

// TODO 为啥用全局? targetMap & activeEffect
const targetMap = new Map()
let activeEffect;
export const track = (target, key) => {
  // target -> key -> dep

  let desMap = targetMap.get(target)
  if (!desMap) {
    desMap = new Map()
    targetMap.set(target, desMap)
  }

  let dep = desMap.get(key)
  if(!dep) {
    dep = new Set()
    desMap.set(key, dep)
  }

  dep.add(activeEffect)
}


export const trigger = (target, key) => {
  const desMap = targetMap.get(target)
  const dep = desMap.get(key)
  for (let effect of dep) {
    effect.run()
  }
}
export const effect = (fn) => {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}