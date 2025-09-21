import React from 'react';
import type { Session, TimeUnit } from '../types';
import './HoldingList.scss';
import HoldingListItem from './HoldingListItem';

type HoldingListProps = {
  sessions: Session[];
  onResume: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
  timeUnit: TimeUnit;
};

const HoldingList: React.FC<HoldingListProps> = ({ sessions, onResume, onDelete, onUpdateMemo, timeUnit }) => {
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
      {sessions.length === 0 ? (
        <p>保留中のセッションはありません。</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <HoldingListItem
              key={session.id}
              session={session}
              elapsedTimeText={formatElapsedTime(session.totalElapsedTime)}
              onResume={onResume}
              onDelete={onDelete}
              onUpdateMemo={onUpdateMemo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HoldingList;