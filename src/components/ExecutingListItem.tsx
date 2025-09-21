import React, { useState } from 'react';
import type { Session } from '../types';
import './ExecutingList.scss';
import PauseIcon from '@mui/icons-material/Pause';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

type ExecutingListItemProps = {
  session: Session;
  onHold: (id: number) => void;
  onFinish: (id: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
  onDelete: (id: number) => void;
};

const ExecutingListItem: React.FC<ExecutingListItemProps> = ({ session, onHold, onFinish, onUpdateMemo, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(session.memo);

  //  開始時刻をフォーマットするヘルパー関数
  const formatInitialTime = (date: Date) => {
    const dateString = date.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
    const timeString = date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    return `${dateString} ${timeString}`;
  };

  const handleSaveMemo = () => {
    onUpdateMemo(session.id, editText);
    setIsEditing(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のイベント(メモ編集)が発火するのを防ぐ
    onDelete(session.id);
  };

  return (
    <li className="executing-item">
      <div className="session-info">
        <span className="worker">{session.worker}</span>
        <span className="task">{session.task}</span>
        {isEditing ? (
          <textarea
            className="memo-editor"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveMemo} // フォーカスが外れたら保存
            autoFocus
          />
        ) : (
          <p className="memo-text" onClick={() => setIsEditing(true)}>
            {session.memo || 'メモを追加...'}
          </p>
        )}
        <span className="start-time">
          開始: {formatInitialTime(session.initialStartTime)}
        </span>
      </div>
      <div className="session-controls">
        <span className="timer-static">実行中...</span>
        <div className="control-button-wrapper">
          <button className="control-button delete" onClick={handleDeleteClick}>
            <DeleteIcon />
          </button>
          <button className="control-button hold" onClick={() => onHold(session.id)}>
            <PauseIcon />
          </button>
          <button className="control-button finish" onClick={() => onFinish(session.id)}>
            <CheckCircleIcon />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ExecutingListItem;