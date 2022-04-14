const queue: any[] = [];
let pending = true;
export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  flushJob();
}
function flushJob() {
  if (pending) {
    pending = false;
    nextTick(() => {
      pending = true;
      let job;
      console.log(queue, "next-tick");
      while ((job = queue.shift())) {
        job && job();
      }
    });
  }
}

const p = Promise.resolve();
export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}
