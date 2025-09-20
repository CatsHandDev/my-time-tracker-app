import React from 'react';
import type { Session } from '../types';
import './HoldingList.scss';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

type HoldingListProps = {
  sessions: Session[];
  onResume: (id: number) => void;
};

const HoldingList: React.FC<HoldingListProps> = ({ sessions, onResume }) => {
  if (sessions.length === 0) {
    return null; // 保留中のセッションがなければ何も表示しない
  }

  const formatElapsedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="holding-list-container">
      <h3>保留中のセッション</h3>
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