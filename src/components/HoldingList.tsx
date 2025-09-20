import React from 'react';
import type { Session, TimeUnit } from '../types';
import './HoldingList.scss';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

type HoldingListProps = {
  sessions: Session[];
  onResume: (id: number) => void;
  timeUnit: TimeUnit;
};

const HoldingList: React.FC<HoldingListProps> = ({ sessions, onResume, timeUnit }) => {
  const formatElapsedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    switch (timeUnit) {
      case 'hours':
        return `${(totalSeconds / 3600).toFixed(2)} h`;
      case 'seconds':
        return `${totalSeconds} s`;
      case 'minutes':
      default:
        return `${(totalSeconds / 60).toFixed(2)} m`;
    }
  };

  return (
    <div className="holding-list-container">
      <ul>
        {sessions.map((session) => (
          <li key={session.id} onClick={() => onResume(session.id)}>
            <div className="session-info">
              <span className="worker">{session.worker}</span>
              <span className="task">{session.task}</span>
            </div>
            <div className="session-status">
              <span className="elapsed-time">{formatElapsedTime(session.totalElapsedTime)}</span>
              <PlayCircleOutlineIcon className="resume-icon" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HoldingList;