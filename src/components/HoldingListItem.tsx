import React, { useState } from 'react';
import type { Session } from '../types';
import './HoldingList.scss';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

type HoldingListItemProps = {
  session: Session;
  elapsedTimeText: string;
  onResume: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
};

const HoldingListItem: React.FC<HoldingListItemProps> = ({ session, elapsedTimeText, onResume, onDelete, onUpdateMemo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(session.memo);

  const handleSaveMemo = () => {
    onUpdateMemo(session.id, editText);
    setIsEditing(false);
  };

  // イベントの伝播を止める
  const handleActionClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    //  編集モード切替をliのonClickに追加
    <li className="holding-item" onClick={() => !isEditing && setIsEditing(true)}>
      <div className="session-info">
        <>
          <span className="worker">{session.worker}</span>
          <span className="task">{session.task}</span>
        </>
        {isEditing ? (
          <textarea
            className="memo-editor"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveMemo}
            onClick={handleActionClick} // textarea内クリックで親のイベントが発火するのを防ぐ
            autoFocus
          />
        ) : (
          <p className="memo-text">
            {session.memo || 'メモを追加...'}
          </p>
        )}
      </div>
      <div className="session-status" onClick={handleActionClick}>
        <span className="elapsed-time">{elapsedTimeText}</span>
        <div className="button-wrapper">
          <button className="delete-session-button" onClick={() => onDelete(session.id)}>
            <DeleteIcon fontSize="medium" />
          </button>
          <button className="resume-button" onClick={() => onResume(session.id)}>
            <PlayCircleOutlineIcon />
          </button>
        </div>
      </div>
    </li>
  );
};

export default HoldingListItem;