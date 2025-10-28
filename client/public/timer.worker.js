// Web Worker para manter a contagem de tempo em background
let startTime = null;
let totalDuration = null;
let isRunning = false;
let pausedTime = 0;

self.onmessage = (event) => {
  const { type, duration, action } = event.data;

  if (type === 'start') {
    totalDuration = duration;
    startTime = Date.now();
    pausedTime = 0;
    isRunning = true;
    sendUpdate();
  } else if (type === 'pause') {
    if (isRunning) {
      pausedTime += Date.now() - startTime;
      isRunning = false;
    }
  } else if (type === 'resume') {
    startTime = Date.now();
    isRunning = true;
    sendUpdate();
  } else if (type === 'reset') {
    startTime = null;
    totalDuration = null;
    isRunning = false;
    pausedTime = 0;
    self.postMessage({ type: 'update', elapsed: 0, remaining: 0, isRunning: false });
  } else if (type === 'tick') {
    if (isRunning) {
      sendUpdate();
    }
  }
};

function sendUpdate() {
  if (!isRunning || !startTime || !totalDuration) {
    return;
  }

  const now = Date.now();
  const elapsed = pausedTime + (now - startTime);
  const remaining = Math.max(0, totalDuration - elapsed);

  self.postMessage({
    type: 'update',
    elapsed,
    remaining,
    isRunning: remaining > 0,
  });

  if (remaining === 0) {
    isRunning = false;
    self.postMessage({ type: 'finished' });
  }
}
