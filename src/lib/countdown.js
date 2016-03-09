const interval = 1000;
const deltaTime = (previousTime, currentTime) => previousTime ? (currentTime - previousTime) : 0;

export default (
  previousTime,
  timeRemaining,
  takingBreak,
  onComplete,
  tick,
  timeFormatter
) => {
  const currentTime = Date.now();
  const delta = deltaTime(previousTime, currentTime);
  const timeRemainingInInterval = (interval - (delta % interval));
  const newTimeRemaining = Math.max(timeRemaining - delta, 0);
  const countdownComplete = (previousTime && timeRemaining <= 0);
  let timeout = timeRemainingInInterval;

  if (countdownComplete && !takingBreak) {
    onComplete();
    document.title = '!! Tomatos!';
    return {
      timeout: null,
      completed: true,
    };
  } else {
    timeout += (timeout < (interval / 2.0)) ? interval : 0;
    document.title = timeFormatter(newTimeRemaining);
    return {
      timeout: countdownComplete ? null : setTimeout(tick, timeout),
      previousTime: currentTime,
      timeRemaining: newTimeRemaining,
      ticking: true
    }
  }
}

