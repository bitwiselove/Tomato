import React from 'react';

export default ({
  numTomatos
}) => {
  if (numTomatos === 0) {
    return (
      <div className="flex-vertical">
        <span className="completed-text">No tomatos completed</span>
        {' '}
        <img src="crying.png" className="icon-small" />
      </div>
    );
  } else {
    let tomatos = [];
    for (let i = 0; i < numTomatos; i++) {
      tomatos.push(<img src="tomato.png" className="icon-small" />);
    }
    return (
      <div className="flex-vertical">
        <span className="completed-text">Tomatos completed:</span>
        {' '}
        {tomatos}
      </div>
    );
  }
}
