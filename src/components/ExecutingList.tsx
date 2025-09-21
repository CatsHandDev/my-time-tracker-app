import React from 'react';
import type { Session } from '../types';
import ExecutingListItem from './ExecutingListItem';
import './ExecutingList.scss';

type ExecutingListProps = {
  sessions: Session[];
  onHold: (id: number) => void;
  onFinish: (id: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
  onDelete: (id: number) => void;
};

const ExecutingList: React.FC<ExecutingListProps> = ({ sessions, onHold, onFinish, onUpdateMemo, onDelete }) => {
  return (
    <div className="executing-list-container">
      {sessions.length === 0 ? (
        <p>現在実行中のセッションはありません。</p>
      ) : (
        <ul>
          {sessions.map(session => (
            <ExecutingListItem
              key={session.id}
              session={session}
              onHold={onHold}
              onFinish={onFinish}
              onUpdateMemo={onUpdateMemo}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExecutingList;