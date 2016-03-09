import React from 'react';
import FormattedTimestamp from '../components/FormattedTimestamp';
import StartButton from '../components/StartButton';
import PlayPauseButton from '../components/PlayPauseButton';

const interval = 1000;
const deltaTime = (previousTime, currentTime) => previousTime ? (currentTime - previousTime) : 0;
const countdown = (
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

  if (countdownComplete && !takingBreak) {
    onComplete();
    document.title = '!! Tomatos!';
    return {
      timeout: null,
      completed: true,
    };
  } else {
    let timeout = timeRemainingInInterval;

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval;
    }

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

export class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
    this.takeBreak = this.takeBreak.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.state = {
      timeRemaining: props.initialTimeInMs,
      previousTime: null,
      timeout: null,
      ticking: false,
      completed: false
    }
  }

  componentWillUnmount() {
    if (this.state.timeout)
      clearTimeout(this.state.timeout);
  }

  tick() {
    this.setState(countdown(
      this.state.previousTime,
      this.state.timeRemaining,
      this.state.takingBreak,
      this.props.onComplete,
      this.tick,
      this.props.timeFormatter
    ));
  }

  reset() {
    this.resetTimer(this.props.initialTimeInMs, () => {
      this.setState({
        takingBreak: false
      }, this.tick);
    });
  }

  resetTimer(milliseconds, cb) {
    clearTimeout(this.state.timeout);
    this.setState({
      timeRemaining: milliseconds,
      previousTime: null,
      timeout: null,
      ticking: false,
      completed: false
    }, cb)
  }

  takeBreak() {
    this.setState({
      takingBreak: true,
    }, this.resetTimer(this.props.breakLength, this.tick));
  }

  resume() {
    this.setState({
      previousTime: Date.now()
    }, this.tick);
  }

  pause() {
    clearTimeout(this.state.timeout);
    this.setState({ ticking: false });
  }

  render() {
    var BreakButton = null;

    if (this.state.completed) {
      var ControlButton = <button className="button button--primary" onClick={this.reset}>Reset Timer</button>;
      if (!this.state.takingBreak) {
        var BreakButton = <button className="button button--cool" onClick={this.takeBreak}>Take a Break</button>;
      }
    } else {
      var ControlButton = this.state.previousTime === null ? <StartButton onClick={this.resume} /> : <PlayPauseButton
        ticking={this.state.ticking}
        onPlay={this.resume}
        onPause={this.pause}
      />;
    }

    return (
      <div>
        <div className="text-center">
          <FormattedTimestamp
            milliseconds={this.state.timeRemaining}
            format={this.props.timeFormatter}
          />
        </div>
        <div className="text-center">
          {ControlButton}
          {BreakButton}
        </div>
      </div>
    );
  }
}
