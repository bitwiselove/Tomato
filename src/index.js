import React from 'react';
import ReactDOM from 'react-dom';

const FormatedTimestamp = ({
  milliseconds
}) => {
  const totalSeconds = Math.round(milliseconds / 1000);
  const seconds = parseInt(totalSeconds % 60, 10);
  const minutes = parseInt(totalSeconds / 60, 10);
  const format = time => time < 10 ? '0' + time : time;

  return <span>{`${format(minutes)}:${format(seconds)}`}</span>
};

const StartButton = ({
  onClick
}) => (
  <button onClick={onClick}>Start Timer</button>
);

const PlayPauseButton = ({
  ticking,
  onPlay,
  onPause
}) => {
  let action = ticking ? onPause : onPlay;
  let label = ticking ? 'Pause Timer' : 'Resume Timer';

  return <button onClick={action}>{label}</button>;
}

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
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
      this.props.onComplete()
      clearTimeout(this.state.timeout);
      this.setState({completed: true});
    }
  }

  reset() {
    clearTimeout(this.state.timeout);
    this.setState({
      timeRemaining: this.props.initialTimeInMs,
      previousTime: null,
      timeout: null,
      ticking: false,
      completed: false
    })
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
    if (this.state.completed) {
      var ControlButton = <button onClick={this.reset}>Reset Timer</button>;
    } else {
      var ControlButton = this.state.previousTime === null ? <StartButton onClick={this.resume} /> : <PlayPauseButton
        ticking={this.state.ticking}
        onPlay={this.resume}
        onPause={this.pause}
      />;
    }

    return (
      <div>
        {' '}
        <FormatedTimestamp milliseconds={this.state.timeRemaining} />
        {' '}
        {ControlButton}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onComplete = this.onComplete.bind(this);
    this.state = {
      tomatos: 0
    }
  }

  onComplete() {
    this.setState({
      tomatos: this.state.tomatos + 1
    });
  }

  render() {
    return (
      <div>
        <h1>Tomato</h1>
        <CountdownTimer
          initialTimeInMs={5000}
          onComplete={this.onComplete}
        />
        <p>{this.state.tomatos}</p>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
