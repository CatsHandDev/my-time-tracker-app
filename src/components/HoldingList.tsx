import React from 'react';
import type { Session, TimeUnit } from '../types';
import './HoldingList.scss';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import DeleteIcon from '@mui/icons-material/Delete';

type HoldingListProps = {
  sessions: Session[];
  onResume: (id: number) => void;
  onDelete: (id: number) => void;
  timeUnit: TimeUnit;
};

const HoldingList: React.FC<HoldingListProps> = ({ sessions, onResume, onDelete, timeUnit }) => {
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

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="holding-list-container">
      {/* ▼▼▼ list-headerは不要なので削除 ▼▼▼ */}

      {sessions.length === 0 ? (
        <p>保留中のセッションはありません。</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session.id} onClick={() => onResume(session.id)}>
              <div className="session-info">
                <span className="worker">{session.worker}</span>
                <span className="task">{session.task}</span>
              </div>
              <div className="session-status">
                <span className="elapsed-time">{formatElapsedTime(session.totalElapsedTime)}</span>
                <button
                  className="delete-session-button"
                  onClick={(e) => handleDeleteClick(e, session.id)}
                >
                  <DeleteIcon fontSize="small" />
                </button>
                <SmartDisplayIcon fontSize="large" className="resume-icon" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HoldingList;