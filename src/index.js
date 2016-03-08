import React from 'react';
import ReactDOM from 'react-dom';

const FormatedTimestamp = ({
  milliseconds
}) => {
  const totalSeconds = Math.round(milliseconds / 1000);
  const seconds = parseInt(totalSeconds % 60, 10);
  const minutes = parseInt(totalSeconds / 60, 10);
  const format = time => time < 10 ? '0' + time : time;

  return <span className="countdown">{`${format(minutes)}:${format(seconds)}`}</span>
};

const StartButton = ({
  onClick
}) => (
  <button className="button button--primary" onClick={onClick}>Start Timer</button>
);

const PlayPauseButton = ({
  ticking,
  onPlay,
  onPause
}) => {
  let action = ticking ? onPause : onPlay;
  let label = ticking ? 'Pause Timer' : 'Resume Timer';

  return <button className="button button--primary" onClick={action}>{label}</button>;
}

class CountdownTimer extends React.Component {
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
    var currentTime = Date.now();
    var dt = this.state.previousTime ? (currentTime - this.state.previousTime) : 0;
    var interval = 1000;

    var timeRemainingInInterval = (interval - (dt % interval));
    var timeout = timeRemainingInInterval;

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval;
    }

    var timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
    var countdownComplete = (this.state.previousTime && timeRemaining <= 0);

    this.setState({
      timeout: countdownComplete ? null : setTimeout(this.tick, timeout),
      previousTime: currentTime,
      timeRemaining: timeRemaining,
      ticking: true
    });

    if (countdownComplete) {
      if (!this.state.takingBreak)
        this.props.onComplete()

      clearTimeout(this.state.timeout);
      this.setState({completed: true});
    }
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
          <FormatedTimestamp milliseconds={this.state.timeRemaining} />
        </div>
        <div className="text-center">
          {ControlButton}
          {BreakButton}
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.tomatoTime = 1000 * 60 * 25;
    this.smallBreak = 1000 * 60 * 5;
    this.largeBreak = 1000 * 60 * 25;
    this.onComplete = this.onComplete.bind(this);
    this.state = {
      totalTomatos: 0,
      breakCounter: 0,
      breakLength: this.smallBreak,
    }
  }

  onComplete() {
    if ((this.state.breakCounter + 1) < 4) {
      this.setState({
        totalTomatos: this.state.totalTomatos + 1,
        breakCounter: this.state.breakCounter + 1,
        breakLength: this.smallBreak,
      });
    } else {
      this.setState({
        totalTomatos: this.state.totalTomatos + 1,
        breakCounter: 0,
        breakLength: this.largeBreak,
      });
    }
  }

  render() {
    var tomatos = [];
    for (var i = 0; i < this.state.totalTomatos; i++) {
      tomatos.push(<img src="http://emojipedia-us.s3.amazonaws.com/cache/89/dd/89dd52458d0d4c147b56bfa316ce5fe2.png" className="icon-small" />);
    }
    tomatos = tomatos.length > 0 ? tomatos : <img src="http://emojipedia-us.s3.amazonaws.com/cache/2c/e1/2ce12e2adad77ef4248afab9c094f08e.png" className="icon-small" />


    return (
      <div>
        <div className="container">
          <h1><img src="http://emojipedia-us.s3.amazonaws.com/cache/89/dd/89dd52458d0d4c147b56bfa316ce5fe2.png"/></h1>
          <CountdownTimer
            initialTimeInMs={this.tomatoTime}
            breakLength={this.state.breakLength}
            onComplete={this.onComplete}
          />
          <div className="flex-vertical">
            <span className="completed-text">Tomatos completed:</span> {tomatos}
          </div>
        </div>
        <p className="credits">Created by <a href="http://forkbombs.com" target="_blank">Brandon Newton</a>.</p>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
