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
    this.tick = this.tick.bind(this);
    this.state = {
      timeRemaining: props.initialTimeInMs,
      previousTime: null,
      timeoutId: null,
      ticking: false,
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
      clearTimeout(this.state.timeout);
    }
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
    return (
      <div>
        <FormatedTimestamp milliseconds={this.state.timeRemaining} />
        {' '}
        <PlayPauseButton
          ticking={this.state.ticking}
          onPlay={this.resume}
          onPause={this.pause}
        />
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Tomato</h1>
        <CountdownTimer
          initialTimeInMs={1500000}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
