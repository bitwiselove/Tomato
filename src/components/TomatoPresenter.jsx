import React from 'react';

export default ({
  numTomatos
}) => {
  if (numTomatos === 0) {
    return (
      <div className="flex-vertical">
        <span className="completed-text">No tomatos completed</span>
        {' '}
        <img src="http://emojipedia-us.s3.amazonaws.com/cache/2c/e1/2ce12e2adad77ef4248afab9c094f08e.png" className="icon-small" />
      </div>
    );
  } else {
    let tomatos = [];
    for (let i = 0; i < numTomatos; i++) {
      tomatos.push(<img src="http://emojipedia-us.s3.amazonaws.com/cache/89/dd/89dd52458d0d4c147b56bfa316ce5fe2.png" className="icon-small" />);
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
