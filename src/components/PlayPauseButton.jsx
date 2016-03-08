import React from 'react';

export default ({
  ticking,
  onPlay,
  onPause
}) => {
  let action = ticking ? onPause : onPlay;
  let label = ticking ? 'Pause Timer' : 'Resume Timer';

  return <button className="button button--primary" onClick={action}>{label}</button>;
}
